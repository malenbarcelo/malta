const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Sales_wp_posts

const wpPostsQueries = {
    monthPosts: async(month,year) => {        
        const monthPosts = await model.findAll({
            where:{
                month:month,
                year:year
            },
            raw:true,
        })
        return monthPosts
    },
    createPosts: async(newPosts) => {
        await model.bulkCreate(newPosts)
    },
    getMaxId: async() => {
        const maxId = await model.findOne({
            order: [['ID', 'DESC']],
            raw: true
        })

        return maxId
    },
    getPostsToSave: async (firstPostId) => {
        const postsToSave = await model.findAll({
            attributes:[['ID','post_id'],['post_date','post_date']],
            where: {
                ID: {
                    [Op.gte]: firstPostId,
                },
            },
            raw: true,
        })
    
        return postsToSave
    }
}       

module.exports = wpPostsQueries