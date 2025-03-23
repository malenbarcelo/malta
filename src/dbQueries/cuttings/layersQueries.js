const db = require('../../../database/models')
const { sequelize } = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Cuttings_layers

const layersQueries = {
    get: async({limit,offset,filters}) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        // where        
        const where = {}

        if (filters.id_layers) {
            where.id_layers = filters.id_layers
        }

        const data = await model.findAndCountAll({
            where,
            limit,
            order,
            offset
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
    getMaxId: async() => {

        const data = await model.max('id_layers')

        return data
    },
}       

module.exports = layersQueries