/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bus_names', {
    bus_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    bus_name: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'bus_names'
  });
};
