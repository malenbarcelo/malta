module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_channels"
    const cols = {
       id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
       },
       sales_channel:{
         type: DataTypes.STRING,
         allowNull: true,
       },
       enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }
    const config = {
    tableName : 'sales_channels',
    timestamps : false
    }
    const Sale_channel = sequelize.define(alias, cols, config)
    
    return Sale_channel
 }