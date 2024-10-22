const { Sequelize } = require("sequelize"); // import sequelize
const config = require('./config/config');

const sequelize = new Sequelize(config.env.DB_NAME, config.env.DB_USER, config.env.DB_PASSWORD + "", {
  host: config.env.DB_HOST,
  port: config.env.DB_PORT,
  dialect: "postgres",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("connection has been established successfully");
  } catch (error) {
    console.log("unable to connect to the database", error);
  }
})();

module.exports = sequelize;
