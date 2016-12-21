/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('routes', {
    route_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    bus_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    stand_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'routes'
  });
};
