module.exports = (sequelize, DataTypes) => {

    const alias = "Data_orders_managers"
    const cols = {
       id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
       },
       order_manager_name:{
         type: DataTypes.STRING,
         allowNull: false,
       },
       id_users:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }
    const config = {
    tableName : 'data_orders_managers',
    timestamps : false
    }
    const Data_order_manager = sequelize.define(alias, cols, config)

    Data_order_manager.associate = (models) => {
      Data_order_manager.belongsTo(models.Users,{
          as:'user_data',
          foreignKey: 'id_users'
      })
    }
    return Data_order_manager
 }