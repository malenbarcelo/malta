module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_ninox_orders_details"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      id_invoices:{
        type : DataTypes.INTEGER,        
        allowNull: false
      },
      date:{
        type : DataTypes.DATE,        
        allowNull: false
      },
      time:{
        type : DataTypes.STRING,        
        allowNull: false
      },
      invoice_number:{
        type : DataTypes.STRING,
        allowNull: false
      },
      id_branches:{
        type : DataTypes.INTEGER,
        allowNull: false
      },
      branch:{
        type : DataTypes.STRING,
        allowNull: false
      },
      id_customers:{
        type : DataTypes.INTEGER,
        allowNull: true
      },
      customer:{
        type : DataTypes.STRING,
        allowNull: false
      },
      id_products:{
        type : DataTypes.INTEGER,
        allowNull: true
      },
      product_code:{
        type : DataTypes.STRING,
        allowNull: false
      },
      description:{
        type : DataTypes.STRING,
        allowNull: true
      },
      size:{
        type : DataTypes.STRING,
        allowNull: true
      },
      color:{
        type : DataTypes.STRING,
        allowNull: true
      },
      quantity:{
        type : DataTypes.INTEGER,
        allowNull: false
      },
      unit_price:{
        type : DataTypes.DECIMAL,
        allowNull: false
      },
      payment_method:{
        type : DataTypes.INTEGER,
        allowNull: false
      },
      id_payment_methods:{
        type : DataTypes.INTEGER,
        allowNull: true
      },

    }
    const config = {
    tableName : 'sales_ninox_orders_details',
    timestamps : false
    }

    const Sales_ninox_order_detail = sequelize.define(alias, cols, config)

    Sales_ninox_order_detail.associate = (models) => {
      Sales_ninox_order_detail.belongsTo(models.Customers,{
         as:'ninox_orders_details_customers',
         foreignKey: 'id_customers'
      }),
      Sales_ninox_order_detail.belongsTo(models.Products,{
        as:'ninox_orders_details_products',
        foreignKey: 'id_products'
     }),
     Sales_ninox_order_detail.belongsTo(models.Payment_methods,{
      as:'ninox_orders_details_payment_methods',
      foreignKey: 'id_payment_methods'
      })
    }
    
    return Sales_ninox_order_detail
 }