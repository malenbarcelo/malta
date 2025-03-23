module.exports = (sequelize, DataTypes) => {

    const alias = "Cuttings"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      date:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      cutting:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_molds:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_layers:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      base:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fabric_mu:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      kgs_mts:{
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      cutting_order_obs:{
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }

    const config = {
      tableName : 'cuttings',
      timestamps : false
    }

    const Cutting = sequelize.define(alias, cols, config)

    Cutting.associate = (models) => {
      Cutting.belongsTo(models.Cuttings_molds,{
        as:'mold_data',
        foreignKey: 'id_molds'
      }),
      Cutting.hasMany(models.Cuttings_layers,{
        as:'layers_data',
        foreignKey: 'id_layers',
        sourceKey:'id_layers'
      })
    }

    return Cutting
    
 }