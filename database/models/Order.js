module.exports = (sequelize, DataTypes) => {

    const alias = "Orders"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      order_number:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      sales_channel:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      id_customers:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      subtotal:{
      type: DataTypes.STRING,
      allowNull: true,
      },
      discount:{
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      total:{
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      status:{
      type: DataTypes.STRING,
      allowNull: false
      },
      order_manager:{
        type: DataTypes.STRING,
        allowNull: false
      },
      observations:{
        type: DataTypes.STRING,
        allowNull: true
      }
    }
    const config = {
    tableName : 'orders',
    timestamps : false
    }

    const Order = sequelize.define(alias, cols, config)

    Order.associate = (models) => {
      Order.belongsTo(models.Customers,{
         as:'orders_customers',
         foreignKey: 'id_customers'
      })
    }
    
    return Order
 }