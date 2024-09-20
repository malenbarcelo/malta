module.exports = (sequelize, DataTypes) => {

    const alias = "Cuttings_colors"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      color:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }

    const config = {
      tableName : 'cuttings_colors',
      timestamps : false
    }

    const Cutting_color = sequelize.define(alias, cols, config)

    return Cutting_color
    
 }