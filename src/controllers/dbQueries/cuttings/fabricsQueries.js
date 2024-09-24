const db = require('../../../../database/models')
const sequelize = require('sequelize')
const model = db.Cuttings_fabrics

const fabrics = {
    allData: async() => {
        const allData = await model.findAll({
            order:[['fabric','ASC']],
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
    create: async(data) => {
        await model.create(
            {
                fabric:data,
                enabled:1,
            },
        )
    },
}       

module.exports = fabrics