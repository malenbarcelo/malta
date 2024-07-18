module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_wp_postmeta"
    const cols = {
      meta_id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      post_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      meta_key:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      meta_value:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }
    const config = {
    tableName : 'sales_wp_postmeta',
    timestamps : false
    }

    const Sale_wp_postmeta = sequelize.define(alias, cols, config)
    
    return Sale_wp_postmeta
 }