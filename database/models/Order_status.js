module.exports = (sequelize, DataTypes) => {

    const alias = "Orders_status"
    const cols = {
       id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
       },
       order_status:{
         type: DataTypes.STRING,
         allowNull: false,
       },
    }
    const config = {
    tableName : 'orders_status',
    timestamps : false
    }
    const Order_status = sequelize.define(alias, cols, config)
    
    return Order_status
 }