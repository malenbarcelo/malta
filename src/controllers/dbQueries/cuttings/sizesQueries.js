const db = require('../../../../database/models')
const sequelize = require('sequelize')
const model = db.Cuttings_sizes

const sizes = {
    allData: async() => {
        const allData = await model.findAll({
            where:{
                enabled:1
            },
            raw:true,
        })
        return allData
    },
    delete: async(id) => {
        await model.update(
            {
                enabled:0,
            },
            {
                where:{
                    id:id
                }
            }
        )
    },
}       

module.exports = sizes