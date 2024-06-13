const db = require('../../../database/models')
const { remoteDB } = require('../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const WP_posts = db.remote.WP_posts
const WP_postmeta = db.remote.WP_postmeta
const { Op } = require('sequelize')

const wpQueries = {
    wpPostsMissing: async(lastID) => {
        const wpPostsMissing = await WP_posts.findAll({
            where: {
                post_type:'shop_order',
                ID: {[Op.gt]: lastID}
            },
            raw:true,
        })

        return wpPostsMissing
    },
    wpPostmetaFindOrders: async(postsIDs) => {
        const wpPostmetaFindOrders = await WP_postmeta.findAll({
            where: {
                post_id:postsIDs,
                meta_key: '_order_number'
            },
            raw:true,
        })

        return wpPostmetaFindOrders
    },
}       

module.exports = wpQueries