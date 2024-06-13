const db = require('../../../database/models')
const { localDB } = require('../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const wpPostsCopied = db.local.WP_posts_copied
const wpPostmetaCopied = db.local.WP_postmeta_copied
const { Op } = require('sequelize')

const wpPostsCopiedQueries = {
    lastID: async() => {
        let lastID = await wpPostsCopied.max('ID')
        return lastID
    },
    addNewPosts: async(newPosts) => {

        for (let i = 0; i < newPosts.length; i++) {
            await wpPostsCopied.create({
                ID:newPosts[i].ID,
                post_date:newPosts[i].post_date,
                post_type:newPosts[i].post_type,
            })
        }
    },
    addNewOrders: async(ordersNumbers) => {

        for (let i = 0; i < ordersNumbers.length; i++) {
            await wpPostmetaCopied.create({
                meta_id:ordersNumbers[i].meta_id,
                post_id:ordersNumbers[i].post_id,
                meta_key:ordersNumbers[i].meta_key,
                meta_value:ordersNumbers[i].meta_value
            })
        }
    },
    getNewWebOrders: async() => {
        const products = await wpPostsCopied.findAll({
            attributes: [['ID','post_id'], ['post_date','date']],
            include: [
                {
                  model: wpPostmetaCopied, 
                  as: 'posts_postmeta', 
                  attributes: [['meta_value','order_number']], 
                }
              ],
            order:[['ID','DESC']],
            raw:true,
            nest:true
        })
        return products
    },
}       

module.exports = wpPostsCopiedQueries