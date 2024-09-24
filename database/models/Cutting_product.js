module.exports = (sequelize, DataTypes) => {

    const alias = "Cuttings_products"
    const cols = {
      id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false
      },
      product_code:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_products_types:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_fabrics:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      full_description:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      unit_price:{
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      quantity:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      sold_qty:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      commited_qty:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      stock:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      season:{
        type: DataTypes.STRING,
        allowNull: false
      },
      enabled:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
    }

    const config = {
      tableName : 'cuttings_products',
      timestamps : false
    }

    const Cutting_product = sequelize.define(alias, cols, config)

    Cutting_product.associate = (models) => {
      Cutting_product.belongsTo(models.Cuttings_fabrics,{
         as:'product_fabric',
         foreignKey: 'id_fabrics'
      }),
      Cutting_product.belongsTo(models.Cuttings_products_types,{
        as:'product_type',
        foreignKey: 'id_products_types'
      })
      Cutting_product.hasMany(models.Cuttings_products_colors,{
        as:'product_colors',
        foreignKey: 'id_products'
      }),
      Cutting_product.hasMany(models.Cuttings_products_sizes,{
        as:'product_sizes',
        foreignKey: 'id_products'
      })
    }
    
    return Cutting_product
    
 }