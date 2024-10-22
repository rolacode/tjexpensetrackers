const { Datatypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Category = require('./category');

const Expenses = sequelize.define(Expenses, {
    id: {
      type: Datatypes.UUID,
      defaultValue: Datatypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: Datatypes.DECIMAL,
      allowNull: false,
    },
    narration: {
      type: Datatypes.STRING,
      allowNull: false,
    },
}, {
    timestamps: true,
});

Expenses.belongsTo(Category);
Expenses.belongsTo(User, { foreignKey: 'UserId', as: 'user' });

module.exports = Expenses;