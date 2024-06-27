module.exports = (sequelize, DataTypes) => {

    const alias = "Data_payments_methods"
    const cols = {
       id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
       },
       payment_method:{
         type: DataTypes.STRING,
         allowNull: false,
       },
       enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }
    const config = {
    tableName : 'data_payments_methods',
    timestamps : false
    }
    const Data_payment_method = sequelize.define(alias, cols, config)
    
    return Data_payment_method
 }