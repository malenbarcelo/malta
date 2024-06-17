module.exports = (sequelize, DataTypes) => {

    const alias = "Payments"
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
      allowNull: false,
      },
      id_orders:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      amount:{
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      id_payment_methods:{
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }
    const config = {
    tableName : 'payments',
    timestamps : false
    }

    const Payment = sequelize.define(alias, cols, config)

    Payment.associate = (models) => {
      Payment.belongsTo(models.Customers,{
         as:'payments_customers',
         foreignKey: 'id_customers'
      }),
      Payment.belongsTo(models.Payment_methods,{
        as:'payments_payment_methods',
        foreignKey: 'id_payment_methods'
      })
      Payment.belongsTo(models.Orders,{
        as:'payments_orders',
        foreignKey: 'id_orders'
      })
    }
    
    return Payment
 }