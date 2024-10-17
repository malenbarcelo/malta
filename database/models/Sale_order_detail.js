module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_orders_details"
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
         allowNull: true,
       },
       unit_price:{
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      required_quantity:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      confirmed_quantity:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      extended_price:{
         type: DataTypes.DECIMAL,
         allowNull: false
       },
       enabled:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      observations:{
        type: DataTypes.STRING,
        allowNull: true
      },
      observations2:{
        type: DataTypes.STRING,
        allowNull: true
      },

    }
    
    const config = {
      tableName : 'sales_orders_details',
      timestamps : true,
      updatedAt: 'update_at',
      createdAt: 'create_at'

   }

    const Sale_order_detail = sequelize.define(alias, cols, config)

    Sale_order_detail.associate = (models) => {
      Sale_order_detail.belongsTo(models.Sales_orders,{
         as:'orders_details_orders',
         foreignKey: 'id_orders'
      }),
      Sale_order_detail.belongsTo(models.Cuttings_products,{
        as:'product_data',
        foreignKey: 'id_products'
     }),
      Sale_order_detail.hasMany(models.Sales_orders_details_colors,{
        as:'colors',
        foreignKey: 'id_orders_details'
     }),
     Sale_order_detail.hasMany(models.Sales_orders_details_sizes,{
        as:'sizes',
        foreignKey: 'id_orders_details'
    })
  }
  
  return Sale_order_detail
 
}