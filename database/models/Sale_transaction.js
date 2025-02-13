module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_transactions"
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
      amount:{
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      type:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_customers:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_payments_methods:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      id_orders:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      create_at:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      update_at:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      notes:{
        type: DataTypes.STRING,
        allowNull: true,
      },
    }
    const config = {
      tableName : 'sales_transactions',
      timestamps : true,
      updatedAt: 'update_at',
      createdAt: 'create_at'
    }

    const Sale_transaction = sequelize.define(alias, cols, config)

    Sale_transaction.associate = (models) => {
      Sale_transaction.belongsTo(models.Data_customers,{
         as:'customer_data',
         foreignKey: 'id_customers'
      }),
      Sale_transaction.belongsTo(models.Data_payments_methods,{
        as:'payment_method_data',
        foreignKey: 'id_payments_methods'
      }),
      Sale_transaction.belongsTo(models.Sales_orders,{
        as:'order_data',
        foreignKey: 'id_orders'
      })
    }
    
    return Sale_transaction
 }