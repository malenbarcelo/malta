module.exports = (sequelize, DataTypes) => {

    const alias = "Accounts_movements"
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
    tableName : 'accounts_movements',
    timestamps : false
    }

    const Account_movement = sequelize.define(alias, cols, config)

    Account_movement.associate = (models) => {
      Account_movement.belongsTo(models.Customers,{
         as:'payments_customers',
         foreignKey: 'id_customers'
      }),
      Account_movement.belongsTo(models.Orders,{
        as:'payments_orders',
        foreignKey: 'id_orders'
      })
    }
    
    return Account_movement
 }