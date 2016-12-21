/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stand_connections', {
    connction_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    stand_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    prev_stand: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    next_stand: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'stand_connections'
  });
};
