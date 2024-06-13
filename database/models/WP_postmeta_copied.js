module.exports = (sequelize, DataTypes) => {

    const alias = "WP_postmeta_copied"
    const cols = {
      meta_id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
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
    tableName : 'wp_postmeta_copied',
    timestamps : false
    }

    const WP_postmeta_copied = sequelize.define(alias, cols, config)

    WP_postmeta_copied.associate = (models) => {
      WP_postmeta_copied.belongsTo(models.WP_posts_copied,{
         as:'postmeta_posts',
         foreignKey: 'post_id'
      })
    }
    
    return WP_postmeta_copied
 }