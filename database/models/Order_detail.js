module.exports = (sequelize, DataTypes) => {

    const alias = "Orders_details"
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
       unit_price:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      discount:{
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      extended_price:{
         type: DataTypes.DECIMAL,
         allowNull: false
       },
      status:{
        type: DataTypes.STRING,
        allowNull: false
      },
    }
    const config = {
    tableName : 'orders_details',
    timestamps : false
    }

    const Order_detail = sequelize.define(alias, cols, config)

    Order_detail.associate = (models) => {
      Order_detail.belongsTo(models.Orders,{
         as:'orders_details_orders',
         foreignKey: 'id_orders'
      }),
      Order_detail.belongsTo(models.Products,{
        as:'orders_details_products',
        foreignKey: 'id_products'
     })
    }
    
    return Order_detail
 }