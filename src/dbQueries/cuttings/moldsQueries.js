const db = require('../../../database/models')
const { sequelize } = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Cuttings_molds

const moldsQueries = {
    get: async({limit,offset,filters}) => {

        // order
        let order = ''
        if (filters.order) {
            order = filters.order
        }

        // where        
        const where = {
            enabled: 1
        }

        if (filters.mold_string) {
            where.mold = {
                [Op.like]: `%${filters.mold_string}%`
            }
        }

        if (filters.mold) {
            where.mold = filters.mold
        }

        if (filters.description) {
            where.description = {
                [Op.like]: `%${filters.description}%`
            }
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
}       

module.exports = moldsQueries