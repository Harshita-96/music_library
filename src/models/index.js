const Sequelize = require("sequelize");
const dbConfig = require("../config/dbConfig");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  dialect: dbConfig.dialect,
  host: dbConfig.HOST,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./userModel.js")(sequelize, Sequelize.DataTypes);
db.Song = require("./songModel.js")(sequelize, Sequelize.DataTypes);

db.User.hasMany(db.Song, { foreignKey: 'username', as: 'song' });
db.Song.belongsTo(db.User, {
  foreignKey: "username",
  as: "user",
});
module.exports = db;
