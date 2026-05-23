const bcrypt = require('bcrypt');
const crypto = require('crypto');
const authRepository = require('../repository/auth.repository');
const { generateToken, generateRefreshToken, verifyToken } = require('../middleware/jwt.middleware');
const { sendEmail } = require('./mail.service');

class AuthService {
  async register(userData) {
    const existingUser = await authRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = await authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expiry_date = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await authRepository.createEmailVerificationToken({
      token,
      expiry_date,
      user_id: user.id,
    });

    const verificationLink = `http://localhost:${process.env.PORT || 5000}/api/auth/verify-email?token=${token}`;
    await sendEmail(user.email, 'Email Verification', `Click the link to verify: ${verificationLink}`);

    const accessToken = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    return { user, token: accessToken, refreshToken };
  }

  async login(email, password) {
    let user = await authRepository.findUserByEmail(email);
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const name = email.split('@')[0];
      user = await authRepository.createUser({
        name,
        email,
        password: hashedPassword,
        is_verified: true,
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }
    }

    const token = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    return { user, token, refreshToken };
  }

  async forgotPassword(email) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry_date = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await authRepository.createPasswordResetToken({
      token,
      expiry_date,
      user_id: user.id,
    });

    const resetLink = `http://localhost:${process.env.PORT || 5000}/api/auth/reset-password?token=${token}`;
    await sendEmail(user.email, 'Password Reset', `Click the link to reset password: ${resetLink}`);
  }

  async resetPassword(token, newPassword) {
    const resetToken = await authRepository.findPasswordResetToken(token);
    if (!resetToken || resetToken.expiry_date < new Date()) {
      throw new Error('Invalid or expired token');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await authRepository.updateUser(resetToken.user_id, { password: hashedPassword });
    await authRepository.deletePasswordResetToken(token);
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await authRepository.findUserById(userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error('Incorrect old password');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await authRepository.updateUser(userId, { password: hashedPassword });
  }

  async verifyEmail(token) {
    const verificationToken = await authRepository.findEmailVerificationToken(token);
    if (!verificationToken || verificationToken.expiry_date < new Date()) {
      throw new Error('Invalid or expired token');
    }

    await authRepository.updateUser(verificationToken.user_id, { is_verified: true });
    await authRepository.deleteEmailVerificationToken(token);
  }

  async updateProfile(userId, updateData) {
    return await authRepository.updateUser(userId, updateData);
  }

  async refresh(refreshToken) {
    try {
      const decoded = verifyToken(refreshToken);
      const user = await authRepository.findUserById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }
      const accessToken = generateToken(user.id, user.role);
      const newRefreshToken = generateRefreshToken(user.id);
      return { user, accessToken, refreshToken: newRefreshToken };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = new AuthService();
