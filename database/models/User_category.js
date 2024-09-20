module.exports = (sequelize, DataTypes) => {

    const alias = "Users_categories"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      category_name:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }

    const config = {
      tableName : 'users_categories',
      timestamps : false
    }

    const User_category = sequelize.define(alias, cols, config)

    User_category.associate = (models) => {
      User_category.hasMany(models.Users_permissions,{
         as:'category_permissions',
         foreignKey: 'id_users_categories'
      })
    }
    
    return User_category
 }