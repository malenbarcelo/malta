module.exports = (sequelize, DataTypes) => {

    const alias = "Data_orders_status"
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
    tableName : 'data_orders_status',
    timestamps : false
    }
    const Data_order_status = sequelize.define(alias, cols, config)
    
    return Data_order_status
 }