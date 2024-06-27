module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_orders"
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
      id_sales_channels:{
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
    tableName : 'sales_orders',
    timestamps : false
    }

    const Sale_order = sequelize.define(alias, cols, config)

    Sale_order.associate = (models) => {
      Sale_order.belongsTo(models.Data_customers,{
         as:'orders_customers',
         foreignKey: 'id_customers'
    }),
      Sale_order.belongsTo(models.Data_orders_managers,{
        as:'orders_orders_managers',
        foreignKey: 'id_orders_managers'
    }),
     Sale_order.belongsTo(models.Data_orders_status,{
      as:'orders_orders_status',
      foreignKey: 'id_orders_status'
    }),
    Sale_order.belongsTo(models.Data_payments_status,{
      as:'orders_payments_status',
      foreignKey: 'id_payments_status'
    }),
    Sale_order.belongsTo(models.Data_sales_channels,{
      as:'orders_sales_channels',
      foreignKey: 'id_sales_channels'
    })
  }
  return Sale_order
 }