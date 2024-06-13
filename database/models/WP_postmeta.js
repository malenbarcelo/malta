module.exports = (sequelize, DataTypes) => {

    const alias = "WP_postmeta"
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
    }
    const config = {
    tableName : 'wp_postmeta',
    timestamps : false
    }

    const WP_postmeta = sequelize.define(alias, cols, config)
    
    return WP_postmeta
 }