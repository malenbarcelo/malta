module.exports = (sequelize, DataTypes) => {

    const alias = "Users_tasks"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      task:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }

    const config = {
      tableName : 'users_tasks',
      timestamps : false
    }

    const User_task = sequelize.define(alias, cols, config)
    
    return User_task
 }