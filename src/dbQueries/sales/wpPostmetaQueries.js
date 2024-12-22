const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Sales_wp_postmeta

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
    createPostmeta: async(newPostmeta) => {
        await model.bulkCreate(newPostmeta)
    },
    getMaxId: async() => {
        const maxId = await model.findOne({
            order: [['meta_id', 'DESC']],
            raw: true
        })

        return maxId
    },
    getPostsToSave: async (firstPostId) => {
        const postsToSave = await model.findAll({
            attributes:[['post_id','post_id'],['meta_key','meta_key'],['meta_value','meta_value']],
            where: {
                post_id: {
                    [Op.gte]: firstPostId,
                },
            },
            raw: true,
        })
    
        return postsToSave
    }
}       

module.exports = wpPostmetaQueries