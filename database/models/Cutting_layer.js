module.exports = (sequelize, DataTypes) => {

    const alias = "Cuttings_layers"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      id_layers:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      position:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      color:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      layers:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      kgs_mts:{
        type: DataTypes.DECIMAL,
        allowNull: true,
      }
    }

    const config = {
      tableName : 'cuttings_layers',
      timestamps : false
    }

    const Cutting_layer = sequelize.define(alias, cols, config)

    return Cutting_layer
    
 }