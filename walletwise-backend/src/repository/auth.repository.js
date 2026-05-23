const { User, PasswordResetToken, EmailVerificationToken } = require('../model');

class AuthRepository {
  async createUser(userData) {
    return await User.create(userData);
  }

  async findUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findUserById(id) {
    return await User.findByPk(id);
  }

  async updateUser(id, updateData) {
    const updated = await User.update(updateData, { where: { id }, returning: true });
    return updated[1][0];
  }

  async createPasswordResetToken(data) {
    return await PasswordResetToken.create(data);
  }

  async findPasswordResetToken(token) {
    return await PasswordResetToken.findOne({ where: { token } });
  }

  async deletePasswordResetToken(token) {
    return await PasswordResetToken.destroy({ where: { token } });
  }

  async createEmailVerificationToken(data) {
    return await EmailVerificationToken.create(data);
  }

  async findEmailVerificationToken(token) {
    return await EmailVerificationToken.findOne({ where: { token } });
  }

  async deleteEmailVerificationToken(token) {
    return await EmailVerificationToken.destroy({ where: { token } });
  }
}

module.exports = new AuthRepository();
