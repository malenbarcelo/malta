module.exports = (sequelize, DataTypes) => {

    const alias = "Cuttings_products_sizes"
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
      id_sizes:{
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }

    const config = {
      tableName : 'cuttings_products_sizes',
      timestamps : false
    }

    const Cutting_product_size = sequelize.define(alias, cols, config)

    Cutting_product_size.associate = (models) => {
      Cutting_product_size.belongsTo(models.Cuttings_sizes,{
         as:'size_data',
         foreignKey: 'id_sizes'
      })
    }

    return Cutting_product_size
    
 }