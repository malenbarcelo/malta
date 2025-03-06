module.exports = (sequelize, DataTypes) => {

    const alias = "Cuttings_molds"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      mold:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      description:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      units_per_layer:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }

    const config = {
      tableName : 'cuttings_molds',
      timestamps : false
    }

    const Cutting_molds = sequelize.define(alias, cols, config)

    return Cutting_molds
    
 }