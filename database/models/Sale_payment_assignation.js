module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_payments_assignations"
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
      type:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_payments:{
        type: DataTypes.INTEGER,
        allowNull: true,
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
      notes:{
        type: DataTypes.STRING,
        allowNull: true,
      }
    }
    const config = {
    tableName : 'sales_payments_assignations',
    timestamps : false
    }

    const Sale_payment_assignation = sequelize.define(alias, cols, config)

    Sale_payment_assignation.associate = (models) => {
      Sale_payment_assignation.belongsTo(models.Sales_orders,{
         as:'assigantions_orders',
         foreignKey: 'id_orders'
      }),
      Sale_payment_assignation.belongsTo(models.Data_customers,{
        as:'assignations_customers',
        foreignKey: 'id_orders'
     })
    }
    
    return Sale_payment_assignation
 }