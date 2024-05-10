module.exports = (sequelize, DataTypes) => {

    const alias = "Orders_managers"
    const cols = {
       id:{
       type : DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement : true,
       allowNull: false
       },
       order_manager_name:{
         type: DataTypes.STRING,
         allowNull: false,
       },
    }
    const config = {
    tableName : 'orders_managers',
    timestamps : false
    }
    const Order_manager = sequelize.define(alias, cols, config)
    
    return Order_manager
 }