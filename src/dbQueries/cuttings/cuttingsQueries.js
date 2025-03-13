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

        // where        
        const where = {
            enabled: 1
        }

        if (filters.cutting) {
            where.cutting = filters.cutting
        }

        const data = await model.findAndCountAll({
            include:[
                {'association':'mold_data'},
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
}       

module.exports = cuttingsQueries