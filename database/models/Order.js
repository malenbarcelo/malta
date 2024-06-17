module.exports = (sequelize, DataTypes) => {

    const alias = "Orders"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      date:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      order_number:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      sales_channel:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_customers:{
        type: DataTypes.INTEGER,
        allowNull: false,
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
        allowNull: true
      },
      id_orders_status:{
      type: DataTypes.INTEGER,
      allowNull: false
      },
      id_payments_status:{
        type: DataTypes.INTEGER,
        allowNull: false
        },
      id_orders_managers:{
        type: DataTypes.STRING,
        allowNull: true
      },
      observations:{
        type: DataTypes.STRING,
        allowNull: true
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: true
      },

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
    }),
      Order.belongsTo(models.Orders_managers,{
        as:'orders_orders_managers',
        foreignKey: 'id_orders_managers'
    }),
     Order.belongsTo(models.Orders_status,{
      as:'orders_orders_status',
      foreignKey: 'id_orders_status'
    }),
    Order.belongsTo(models.Payments_status,{
      as:'orders_payments_status',
      foreignKey: 'id_payments_status'
    })
    }
    
    return Order
 }