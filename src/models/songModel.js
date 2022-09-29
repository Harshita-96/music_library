module.exports = (sequelize, DataTypes) => {
  var models = require("./index");
  const Song = sequelize.define("song", {
    songname: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    artist: {
      type: DataTypes.STRING,
      unique: false, 
      allowNull: true,
    },
  });

  return Song;
};
