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
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_molds:{
        type: DataTypes.INTEGER,
        allowNull: false,
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
        foreignKey: 'id_cuttings'
      })
    }

    return Cutting
    
 }