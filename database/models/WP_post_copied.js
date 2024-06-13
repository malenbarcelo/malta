module.exports = (sequelize, DataTypes) => {

    const alias = "WP_posts_copied"
    const cols = {
      ID:{
        type : DataTypes.INTEGER,
        primaryKey: true,
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
    tableName : 'wp_posts_copied',
    timestamps : false
    }

    const WP_posts_copied = sequelize.define(alias, cols, config)

    WP_posts_copied.associate = (models) => {
      WP_posts_copied.hasOne(models.WP_postmeta_copied, {
        foreignKey: 'post_id',
        as: 'posts_postmeta'
      });
    };
    
    return WP_posts_copied
 }