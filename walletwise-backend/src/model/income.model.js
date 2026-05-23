const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Income = sequelize.define('Income', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'income',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Income;
