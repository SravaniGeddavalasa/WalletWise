const User = require('./user.model');
const Expense = require('./expense.model');
const Income = require('./income.model');
const Budget = require('./budget.model');
const PasswordResetToken = require('./passwordResetToken.model');
const EmailVerificationToken = require('./emailVerificationToken.model');

// User - Expense (1:N)
User.hasMany(Expense, { foreignKey: 'user_id', as: 'expenses' });
Expense.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User - Income (1:N)
User.hasMany(Income, { foreignKey: 'user_id', as: 'incomes' });
Income.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User - Budget (1:N)
User.hasMany(Budget, { foreignKey: 'user_id', as: 'budgets' });
Budget.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User - PasswordResetToken (1:N)
User.hasMany(PasswordResetToken, { foreignKey: 'user_id', as: 'passwordResetTokens' });
PasswordResetToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User - EmailVerificationToken (1:N)
User.hasMany(EmailVerificationToken, { foreignKey: 'user_id', as: 'emailVerificationTokens' });
EmailVerificationToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  User,
  Expense,
  Income,
  Budget,
  PasswordResetToken,
  EmailVerificationToken,
};
