module.exports = (sequelize, DataTypes) => {

    const alias = "Cuttings_products_types"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      product_type:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }

    const config = {
      tableName : 'cuttings_products_types',
      timestamps : false
    }

    const Cutting_product_type = sequelize.define(alias, cols, config)

    return Cutting_product_type
    
 }