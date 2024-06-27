module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_orders_details"
    const cols = {
       id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
       },
       id_orders:{
         type: DataTypes.INTEGER,
         allowNull: false,
       },
       id_products:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
       description:{
         type: DataTypes.STRING,
         allowNull: true,
       },
       color:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      size:{
        type: DataTypes.STRING,
        allowNull: true,
      },        
       unit_price:{
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      required_quantity:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      confirmed_quantity:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      extended_price:{
         type: DataTypes.DECIMAL,
         allowNull: false
       },
    }
    const config = {
    tableName : 'sales_orders_details',
    timestamps : false
    }

    const Sale_order_detail = sequelize.define(alias, cols, config)

    Sale_order_detail.associate = (models) => {
      Sale_order_detail.belongsTo(models.Sales_orders,{
         as:'orders_orders_details',
         foreignKey: 'id_orders'
      })
    }
    
    return Sale_order_detail
 }