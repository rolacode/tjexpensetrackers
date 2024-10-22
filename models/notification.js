const { Datatypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

const Notification = sequelize.define(Notification, {
  id: {
    type: Datatypes.UUID,
    defaultValue: Datatypes.UUIDV4,
    primaryKey: true,
  },
  message: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  UserId: {
    type: Datatypes.UUID,
    references: {
      model: User,
      key: 'id,'
    },
  },
}, {
    timestamps: true,
});

Notification.belongsTo(User, {
  foreignKey: 'UserId', as:'user'
});

module.exports = Notification;