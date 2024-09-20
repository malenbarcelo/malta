module.exports = (sequelize, DataTypes) => {

    const alias = "Cuttings_sizes"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      size:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }

    const config = {
      tableName : 'cuttings_sizes',
      timestamps : false
    }

    const Cutting_size = sequelize.define(alias, cols, config)

    return Cutting_size
    
 }