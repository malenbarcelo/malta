const db = require('../../../database/models')
const { sequelize } = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Cuttings

const cuttingsQueries = {
    get: async({limit,offset,filters}) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        // where cuttings        
        const where = {
            enabled: 1
        }

        if (filters.cutting) {
            where.cutting = filters.cutting
        }

        if (filters.description) {
            where.description = {
                [Op.like]: `%${filters.description}%`
            }
        }

        if (filters.id_layers) {
            where.id_layers = filters.id_layers
        }

        // where molds
        const whereMolds = {}
        if (filters.mold_string) {
            whereMolds.mold = {
                [Op.like]: `%${filters.mold_string}%`
            }
        }

        const data = await model.findAndCountAll({
            include:[
                {
                    'association':'mold_data',
                    where: whereMolds,
                },
                {'association':'layers_data'}

            ],
            where,
            limit,
            order,
            offset,
            nest:true
        })

        return data
    },
    create: async(data) => {
        const newData = await model.bulkCreate(data)
        return newData
    },
    update: async(data) => {        
        for (const d of data) {
            await model.update(
            d, 
            { where: { id: d.id } }
            )
        }
    },
    getMaxCuttingNumber: async() => {

        const data = await model.max('cutting')

        return data
    },
}       

module.exports = cuttingsQueries