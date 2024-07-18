const db = require('../../../../database/models')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const model = db.local.Sales_wp_posts
const { Op } = require('sequelize')
const { raw } = require('mysql2')

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
        for (let i = 0; i < newPosts.length; i++) {
            await model.create({
                ID:newPosts[i].ID,
                post_date:newPosts[i].post_date,
                post_type:newPosts[i].post_type,
                post_status:newPosts[i].post_status,
                month:parseInt(newPosts[i].post_date.split('-')[1]),
                year:parseInt(newPosts[i].post_date.split('-')[0]),
            })
        }
    },
}       

module.exports = wpPostsQueries