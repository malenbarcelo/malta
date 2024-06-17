module.exports = (sequelize, DataTypes) => {

    const alias = "Payments_status"
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
    tableName : 'payments_status',
    timestamps : false
    }
    const Payment_status = sequelize.define(alias, cols, config)
    
    return Payment_status
 }