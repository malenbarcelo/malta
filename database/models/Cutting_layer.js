module.exports = (sequelize, DataTypes) => {

    const alias = "Cuttings_layers"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      id_cuttings:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      color:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      layers:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      kgs_mts:{
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      mu:{
        type: DataTypes.STRING,
        allowNull: false,
      },
    }

    const config = {
      tableName : 'cuttings_layers',
      timestamps : false
    }

    const Cutting_layer = sequelize.define(alias, cols, config)

    Cutting_layer.associate = (models) => {
      Cutting_layer.belongsTo(models.Cuttings,{
        as:'cutting_data',
        foreignKey: 'id_cuttings'
      })
    }

    return Cutting_layer
    
 }