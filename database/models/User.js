module.exports = (sequelize, DataTypes) => {

    const alias = "Users"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      user:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_users_categories:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_sales_channels:{
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      password:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }

    const config = {
      tableName : 'users',
      timestamps : false
    }

    const User = sequelize.define(alias, cols, config)

    User.associate = (models) => {
      User.belongsTo(models.Users_categories,{
         as:'user_category',
         foreignKey: 'id_users_categories'
      }),
      User.belongsTo(models.Data_sales_channels,{
        as:'sales_channel',
        foreignKey: 'id_sales_channels'
     })
    }
    
    return User
 }