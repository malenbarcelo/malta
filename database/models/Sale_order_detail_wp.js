module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_orders_details_wp"
    const cols = {
       id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
       },
       id_orders:{
         type: DataTypes.INTEGER,
         allowNull: false,
       },
       id_products:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      color:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      size:{
        type: DataTypes.STRING,
        allowNull: false,
      },
       unit_price:{
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      quantity:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      extended_price:{
         type: DataTypes.DECIMAL,
         allowNull: false
       },
       observations:{
        type: DataTypes.STRING,
        allowNull: true
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      update_at:{
        type: DataTypes.DATE,
        allowNull: true
      },
      update_observations:{
        type: DataTypes.STRING,
        allowNull: true
      },

    }
    
    const config = {
      tableName : 'sales_orders_details_wp',
      timestamps : true,
      updatedAt: 'update_at',
      createdAt: false

   }

    const Sale_order_detail_wp = sequelize.define(alias, cols, config)

    Sale_order_detail_wp.associate = (models) => {
      Sale_order_detail_wp.belongsTo(models.Sales_orders_wp,{
         as:'order_data',
         foreignKey: 'id_orders'
      }),
      Sale_order_detail_wp.belongsTo(models.Cuttings_products,{
        as:'product_data',
        foreignKey: 'id_products'
     })
  }
  
  return Sale_order_detail_wp
 
}