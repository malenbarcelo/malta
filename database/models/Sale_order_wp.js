module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_orders_wp"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      post_id:{
        type : DataTypes.INTEGER,
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
      payment_method:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subtotal:{
      type: DataTypes.STRING,
      allowNull: true,
      },
      shipping:{
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      fee:{
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
      observations:{
        type: DataTypes.STRING,
        allowNull: true
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: true
      },
      season:{
        type: DataTypes.STRING,
        allowNull: true
      },
      shipping_date:{
        type: DataTypes.DATE,
        allowNull: true
      },
      id_shipping_methods:{
        type: DataTypes.STRING,
        allowNull: true
      },
      shipping_number:{
        type: DataTypes.STRING,
        allowNull: true
      },
      shipping_company:{
        type: DataTypes.STRING,
        allowNull: true
      },
      shipping_observations:{
        type: DataTypes.STRING,
        allowNull: true
      }
    }
    const config = {
      tableName : 'sales_orders_wp',
      timestamps : false
    }

    const Sale_order_wp = sequelize.define(alias, cols, config)

    Sale_order_wp.associate = (models) => {
      Sale_order_wp.belongsTo(models.Data_orders_status,{
        as:'order_status_data',
        foreignKey: 'id_orders_status'
      })
      Sale_order_wp.belongsTo(models.Data_payments_status,{
        as:'payment_status_data',
        foreignKey: 'id_payments_status'
      })
      // Sale_order_wp.belongsTo(models.Data_shipping_methods,{
      //   as:'shipping_method_data',
      //   foreignKey: 'id_shipping_methods'
      // }),
      // Sale_order_wp.belongsTo(models.Data_sales_channels,{
      //   as:'orders_sales_channels',
      //   foreignKey: 'id_sales_channels'
      // }),
      // Sale_order_wp.hasMany(models.Sales_payments_assignations,{
      //   as:'orders_assignations',
      //   foreignKey: 'id_orders'
      // }),
      // Sale_order_wp.hasMany(models.Sales_orders_details,{
      //   as:'orders_orders_details',
      //   foreignKey: 'id_orders'
      // })
    }

  return Sale_order_wp

 }