module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_wp_order_items"
    const cols = {
      order_item_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      order_item_name:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      order_item_type:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      order_id:{
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
    tableName : 'sales_wp_order_items',
    timestamps : false
    }

    const Sale_wp_order_items = sequelize.define(alias, cols, config)

    Sale_wp_order_items.associate = (models) => {
      Sale_wp_order_items.hasMany(models.Sales_wp_order_itemmeta,{
        as:'itemmeta',
        foreignKey: 'order_item_id'
      })
    }
    
    return Sale_wp_order_items
 }