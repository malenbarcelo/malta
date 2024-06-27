module.exports = (sequelize, DataTypes) => {

    const alias = "Data_sales_channels"
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
    tableName : 'data_sales_channels',
    timestamps : false
    }
    const Data_sale_channel = sequelize.define(alias, cols, config)
    
    return Data_sale_channel
 }