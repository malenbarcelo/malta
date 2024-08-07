module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_orders_ninox_details"
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
       color:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      size:{
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
        allowNull: true,
      },
    }
    const config = {
    tableName : 'sales_orders_ninox_details',
    timestamps : false
    }

    const Sale_order_ninox_detail = sequelize.define(alias, cols, config)

    Sale_order_ninox_detail.associate = (models) => {
      Sale_order_ninox_detail.belongsTo(models.Sales_orders_ninox,{
         as:'orders_details_orders',
         foreignKey: 'id_orders'
      })
    }
    
    return Sale_order_ninox_detail
 }