module.exports = (sequelize, DataTypes) => {

    const alias = "Sales_wp_posts"
    const cols = {
      ID:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      post_date:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      post_type:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      post_status:{
        type: DataTypes.STRING,
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
    tableName : 'sales_wp_posts',
    timestamps : false
    }

    const Sale_wp_post = sequelize.define(alias, cols, config)
    
    return Sale_wp_post
 }