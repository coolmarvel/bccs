const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("../config")[env];

const BasicAuth = require("./basicAuth");

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.BasicAuth = BasicAuth;

BasicAuth.init(sequelize);

BasicAuth.associate(db);

module.exports = db;
