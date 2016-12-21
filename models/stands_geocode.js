/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stands_geocode', {
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
    tableName: 'stands_geocode'
  });
};
