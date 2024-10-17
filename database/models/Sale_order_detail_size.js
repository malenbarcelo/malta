module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_orders_details_sizes"
    const cols = {
       id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
       },
       id_orders_details:{
         type: DataTypes.INTEGER,
         allowNull: false,
       },
       id_sizes:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    }
    
    const config = {
      tableName : 'sales_orders_details_sizes',
      timestamps : false

   }

    const Sale_order_detail_size = sequelize.define(alias, cols, config)

    Sale_order_detail_size.associate = (models) => {
      Sale_order_detail_size.belongsTo(models.Cuttings_sizes,{
         as:'size_data',
         foreignKey: 'id_sizes'
      })
  }
  
  return Sale_order_detail_size
 
}