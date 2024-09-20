module.exports = (sequelize, DataTypes) => {

    const alias = "Users_permissions"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      id_tasks:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_users_categories:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }

    const config = {
      tableName : 'users_permissions',
      timestamps : false
    }

    const User_permission = sequelize.define(alias, cols, config)

    User_permission.associate = (models) => {
      User_permission.belongsTo(models.Users_tasks,{
         as:'permission_task',
         foreignKey: 'id_tasks'
      }),
      User_permission.belongsTo(models.Users_categories,{
        as:'permission_user_category',
        foreignKey: 'id_users_categories'
     })
    }
    
    return User_permission
 }