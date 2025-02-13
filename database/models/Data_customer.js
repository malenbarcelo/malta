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
      notes:{
        type: DataTypes.STRING,
        allowNull: true
      },
      id_sales_channels:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
    }
    const config = {
    tableName : 'data_customers',
    timestamps : false
    }
    const Data_customer = sequelize.define(alias, cols, config)

    Data_customer.associate = (models) => {
      Data_customer.belongsTo(models.Data_sales_channels,{
        as:'sales_channel_data',
        foreignKey: 'id_sales_channels'
        })
    }
    
    return Data_customer
 }