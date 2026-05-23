const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmailVerificationToken = sequelize.define('EmailVerificationToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'email_verification_tokens',
  timestamps: false,
});

module.exports = EmailVerificationToken;
