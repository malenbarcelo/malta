module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_accounts_movements"
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
      }
    }
    const config = {
    tableName : 'sales_accounts_movements',
    timestamps : false
    }

    const Sale_account_movement = sequelize.define(alias, cols, config)

    Sale_account_movement.associate = (models) => {
      Sale_account_movement.belongsTo(models.Sales_orders,{
         as:'accounts_movements_sales_orders',
         foreignKey: 'id_orders'
      })
    }
    
    return Sale_account_movement
 }