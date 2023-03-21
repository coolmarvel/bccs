const Sequelize = require("sequelize");

module.exports = class BasicAuth extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        username: {
          type: Sequelize.STRING(128),
          allowNull: false,
          unique: true,
        },
        password: { type: Sequelize.STRING(128), allowNull: false },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "BasicAuth",
        tableName: "basicAuth",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {}
};
