module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_orders_ninox"
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
        type: DataTypes.INTEGER,
        allowNull: false,
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
    tableName : 'sales_orders_ninox',
    timestamps : false
    }

    const Sale_order_ninox = sequelize.define(alias, cols, config)

    Sale_order_ninox.associate = (models) => {
      Sale_order_ninox.belongsTo(models.Customers,{
         as:'orders_customers',
         foreignKey: 'id_customers'
      }),
      Sale_order_ninox.belongsTo(models.Orders_managers,{
          as:'orders_orders_managers',
          foreignKey: 'id_orders_managers'
      }),
      Sale_order_ninox.belongsTo(models.Orders_status,{
        as:'orders_orders_status',
        foreignKey: 'id_orders_status'
      }),
      Sale_order_ninox.belongsTo(models.Payments_status,{
        as:'orders_payments_status',
        foreignKey: 'id_payments_status'
      }),
      Sale_order_ninox.hasMany(models.Payments,{
        as:'orders_payments',
        foreignKey: 'id_orders'
      }),
      Sale_order_ninox.hasMany(models.Accounts_movements,{
        as:'orders_accounts_movements',
        foreignKey: 'id_orders'
      })
    }
      
    return Sale_order_ninox
 }