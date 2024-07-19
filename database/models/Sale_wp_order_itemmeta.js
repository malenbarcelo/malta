module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_wp_order_itemmeta"
    const cols = {
      meta_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      order_item_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      meta_key:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      meta_value:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }
    const config = {
    tableName : 'sales_wp_order_itemmeta',
    timestamps : false
    }

    const Sale_wp_order_itemmeta = sequelize.define(alias, cols, config)
    
    return Sale_wp_order_itemmeta
 }