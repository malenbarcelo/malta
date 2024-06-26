module.exports = (sequelize, DataTypes) => {

    const alias = "Cuttings_products"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      product_code:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_type:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      product:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      fabric:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      description:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      color:{
        type: DataTypes.STRING,
        allowNull: false
      },
      size:{
        type: DataTypes.STRING,
        allowNull: false
      },
      unit_price:{
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      quantity:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      sold_qty:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      commited_qty:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      stock:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
    }
    const config = {
    tableName : 'cuttings_products',
    timestamps : false
    }
    const Cutting_product = sequelize.define(alias, cols, config)
    
    return Cutting_product
 }