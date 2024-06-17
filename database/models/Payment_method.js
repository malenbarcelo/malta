module.exports = (sequelize, DataTypes) => {

    const alias = "Payment_methods"
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
    tableName : 'payment_methods',
    timestamps : false
    }
    const Payment_method = sequelize.define(alias, cols, config)
    
    return Payment_method
 }