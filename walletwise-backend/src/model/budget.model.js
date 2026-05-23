const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  limit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  spent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  remaining: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  period: {
    type: DataTypes.STRING,
    defaultValue: 'monthly',
  },
  warning_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 80,
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2024,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'budgets',
  timestamps: false,
});

module.exports = Budget;
