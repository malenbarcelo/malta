module.exports = (sequelize, DataTypes) => {

    const alias = "Data_customers"
    const cols = {
       id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
       },
       customer_name:{
         type: DataTypes.STRING,
         allowNull: false,
       },
       email:{
         type: DataTypes.STRING,
         allowNull: true,
       },
       address:{
         type: DataTypes.STRING,
         allowNull: true,
       },
       country:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      city:{
        type: DataTypes.STRING,
        allowNull: true,
      },
       mobile:{
         type: DataTypes.STRING,
         allowNull: false
       },
       discount:{
        type: DataTypes.DECIMAL,
        allowNull: false
      },
    }
    const config = {
    tableName : 'data_customers',
    timestamps : false
    }
    const Data_Customer = sequelize.define(alias, cols, config)
    
    return Data_Customer
 }