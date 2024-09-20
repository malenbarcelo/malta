module.exports = (sequelize, DataTypes) => {

    const alias = "Seasons"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      season:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      id_users:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }

    const config = {
      tableName : 'seasons',
      timestamps : true,
      createdAt: 'created_at',
      updatedAt: false
    }

    const Season = sequelize.define(alias, cols, config)

    Season.associate = (models) => {
      Season.belongsTo(models.Users,{
         as:'season_user',
         foreignKey: 'id_users'
      })
    }
    
    return Season
 }