const { Datatypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Category = sequelize.define(Category, {
    id: {
      type: Datatypes.UUID,
      defaultValue: Datatypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Datatypes.STRING,
      allowNull: false,
    },
}, {
  timestamps: true,
});

Category.associate = (models) => {
  Category.hasMany(models.Expenses);
};

module.exports = Category;