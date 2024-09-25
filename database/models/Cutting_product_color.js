module.exports = (sequelize, DataTypes) => {

    const alias = "Cuttings_products_colors"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      id_products:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_colors:{
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }

    const config = {
      tableName : 'cuttings_products_colors',
      timestamps : false
    }

    const Cutting_product_color = sequelize.define(alias, cols, config)

    Cutting_product_color.associate = (models) => {
      Cutting_product_color.belongsTo(models.Cuttings_colors,{
         as:'color_data',
         foreignKey: 'id_colors'
      })
    }

    return Cutting_product_color
    
 }