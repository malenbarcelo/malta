module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_payments_ninox"
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
      id_customers:{
      type: DataTypes.INTEGER,
      allowNull: true,
      },
      id_orders:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      amount:{
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      payment_method:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      id_payments_methods:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_payments_methods:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }
    const config = {
    tableName : 'sales_payments_ninox',
    timestamps : false
    }

    const Sale_payment_ninox = sequelize.define(alias, cols, config)

    Sale_payment_ninox.associate = (models) => {
      Sale_payment_ninox.belongsTo(models.Data_customers,{
         as:'payments_customers',
         foreignKey: 'id_customers'
      }),
      Sale_payment_ninox.belongsTo(models.Data_payments_methods,{
        as:'payments_payments_methods',
        foreignKey: 'id_payments_methods'
      }),
      Sale_payment_ninox.belongsTo(models.Sales_orders_ninox,{
        as:'orders_payments',
        foreignKey: 'id_orders'
      })
    }
    
    return Sale_payment_ninox
 }