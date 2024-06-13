module.exports = (sequelize, DataTypes) => {

    const alias = "WP_posts"
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
    }
    const config = {
    tableName : 'wp_posts',
    timestamps : false
    }

    const WP_posts = sequelize.define(alias, cols, config)
    
    return WP_posts
 }