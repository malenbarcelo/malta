module.exports = (sequelize, DataTypes) => {

    const alias = "Data_payments_status"
    const cols = {
       id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
       },
       payment_status:{
         type: DataTypes.STRING,
         allowNull: false,
       },
    }
    const config = {
    tableName : 'data_payments_status',
    timestamps : false
    }
    const Data_payment_status = sequelize.define(alias, cols, config)
    
    return Data_payment_status
 }