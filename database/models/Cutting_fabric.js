module.exports = (sequelize, DataTypes) => {

    const alias = "Cuttings_fabrics"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      fabric:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }

    const config = {
      tableName : 'cuttings_fabrics',
      timestamps : false
    }

    const Cutting_fabric = sequelize.define(alias, cols, config)

    return Cutting_fabric
    
 }