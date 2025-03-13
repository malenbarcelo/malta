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

        if (filters.id_cuttings) {
            where.id_cuttings = filters.id_cuttings
        }

        const data = await model.findAndCountAll({
            include:[{'association':'cutting_data'}],
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
    summary: async({filters}) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }
        
        // where        
        const where = {}

        if (filters.id_cuttings) {
            where.id_cuttings = filters.id_cuttings
        }

        const data = await model.findAll({
            attributes: [
                'id_cuttings',
                'color',
                [fn('SUM', col('layers')), 'total_layers'],
                [fn('SUM', col('kgs_mts')), 'total_kgs_mts']
              ],
              where,
              order,
              group: ['id_cuttings', 'color']
        })

        return data
    },
}       

module.exports = layersQueries