module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_orders_details_colors"
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
       id_colors:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    }
    
    const config = {
      tableName : 'sales_orders_details_colors',
      timestamps : false

   }

    const Sale_order_detail_color = sequelize.define(alias, cols, config)

    Sale_order_detail_color.associate = (models) => {
      Sale_order_detail_color.belongsTo(models.Cuttings_colors,{
         as:'color_data',
         foreignKey: 'id_colors'
      })
  }
  
  return Sale_order_detail_color
 
}