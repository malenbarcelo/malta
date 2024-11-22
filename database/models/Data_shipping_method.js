module.exports = (sequelize, DataTypes) => {

    const alias = "Data_shipping_methods"
    const cols = {
       id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
       },
       shipping_method:{
         type: DataTypes.STRING,
         allowNull: false,
       },
       enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }
    const config = {
    tableName : 'data_shipping_methods',
    timestamps : false
    }
    const Data_shipping_method = sequelize.define(alias, cols, config)
    
    return Data_shipping_method
 }