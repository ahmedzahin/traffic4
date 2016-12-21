/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stand_geocodes', {
    geocode_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    stand_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    lat: {
      type: "DOUBLE",
      allowNull: true
    },
    lng: {
      type: "DOUBLE",
      allowNull: true
    }
  }, {
    tableName: 'stand_geocodes'
  });
};
