module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_payments"
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
      id_payments_methods:{
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }
    const config = {
    tableName : 'sales_payments',
    timestamps : false
    }

    const Sale_payment = sequelize.define(alias, cols, config)

    Sale_payment.associate = (models) => {
      Sale_payment.belongsTo(models.Data_customers,{
         as:'payments_customers',
         foreignKey: 'id_customers'
      }),
      Sale_payment.belongsTo(models.Data_payments_methods,{
        as:'payments_payments_methods',
        foreignKey: 'id_payments_methods'
      })
      Sale_payment.belongsTo(models.Data_sales_channels,{
        as:'payments_sales_channels',
        foreignKey: 'id_sales_channels'
      })
    }
    
    return Sale_payment
 }