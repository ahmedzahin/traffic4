/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stand_names', {
    stand_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    stand_name: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'stand_names'
  });
};
