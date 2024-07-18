const db = require('../../../../database/models')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const model = db.local.Sales_wp_postmeta
const { Op } = require('sequelize')

const wpPostmetaQueries = {
    monthPostmeta: async(month,year) => {
        const monthPostmeta = await model.findAll({
            where:{
                month:month,
                year:year
            },
            raw:true,
        })
        return monthPostmeta
    },
    createPostmeta: async(newPostmeta,month,year) => {
        for (let i = 0; i < newPostmeta.length; i++) {
            await model.create({
                meta_id:newPostmeta[i].meta_id,
                post_id:newPostmeta[i].post_id,
                meta_key:newPostmeta[i].meta_key,
                meta_value:newPostmeta[i].meta_value,
                month:month,
                year:year
            })
        }
    },
}       

module.exports = wpPostmetaQueries