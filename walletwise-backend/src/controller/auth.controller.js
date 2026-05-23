const authService = require('../service/auth.service');
const { sendResponse } = require('../utils/response.util');
const catchAsync = require('../utils/catchAsync');

exports.register = catchAsync(async (req, res) => {
  try {
    const { user, token, refreshToken } = await authService.register(req.body);
    sendResponse(res, 201, true, 'User registered successfully.', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        address: user.address,
        avatar: user.avatar
      },
      accessToken: token,
      refreshToken,
    });
  } catch (err) {
    res.status(400);
    throw err;
  }
});

exports.login = catchAsync(async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token, refreshToken } = await authService.login(email, password);
    sendResponse(res, 200, true, 'Login successful', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        address: user.address,
        avatar: user.avatar
      },
      accessToken: token,
      refreshToken,
    });
  } catch (err) {
    res.status(401);
    throw err;
  }
});

exports.logout = catchAsync(async (req, res) => {
  sendResponse(res, 200, true, 'Logged out successfully');
});

exports.forgotPassword = catchAsync(async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);
    sendResponse(res, 200, true, 'Password reset link sent to email');
  } catch (err) {
    res.status(404);
    throw err;
  }
});

exports.resetPassword = catchAsync(async (req, res) => {
  try {
    const password = req.body.password || req.body.newPassword;
    await authService.resetPassword(req.body.token, password);
    sendResponse(res, 200, true, 'Password reset successfully');
  } catch (err) {
    res.status(400);
    throw err;
  }
});

exports.changePassword = catchAsync(async (req, res) => {
  try {
    const currentPassword = req.body.currentPassword || req.body.oldPassword;
    await authService.changePassword(req.user.id, currentPassword, req.body.newPassword);
    sendResponse(res, 200, true, 'Password changed successfully');
  } catch (err) {
    res.status(400);
    throw err;
  }
});

exports.verifyEmail = catchAsync(async (req, res) => {
  try {
    await authService.verifyEmail(req.query.token);
    sendResponse(res, 200, true, 'Email verified successfully');
  } catch (err) {
    res.status(400);
    throw err;
  }
});

exports.updateProfile = catchAsync(async (req, res) => {
  const updatedUser = await authService.updateProfile(req.user.id, req.body);
  sendResponse(res, 200, true, 'Profile updated successfully', {
    user: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      is_verified: updatedUser.is_verified
    }
  });
});

exports.uploadProfile = catchAsync(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image');
  }
  
  const updatedUser = await authService.updateProfile(req.user.id, { profile_image: req.file.path });
  sendResponse(res, 200, true, 'Profile image uploaded successfully', { profile_image: req.file.path });
});

exports.getProfile = catchAsync(async (req, res) => {
  sendResponse(res, 200, true, 'Profile fetched successfully', {
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address,
      avatar: req.user.avatar,
      role: req.user.role,
      is_verified: req.user.is_verified
    }
  });
});

exports.refresh = catchAsync(async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendResponse(res, 400, false, 'Refresh token is required');
    }
    const data = await authService.refresh(refreshToken);
    sendResponse(res, 200, true, 'Token refreshed successfully', {
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        is_verified: data.user.is_verified,
        address: data.user.address,
        avatar: data.user.avatar
      },
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    });
  } catch (err) {
    res.status(401);
    throw err;
  }
});

exports.uploadAvatarBase64 = catchAsync(async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      return sendResponse(res, 400, false, 'Avatar base64 data is required');
    }
    const updatedUser = await authService.updateProfile(req.user.id, { avatar });
    sendResponse(res, 200, true, 'Avatar updated successfully', { avatar: updatedUser.avatar });
  } catch (err) {
    res.status(400);
    throw err;
  }
});
