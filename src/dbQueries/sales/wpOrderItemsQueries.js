const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col, literal } = require('sequelize')
const model = db.Sales_wp_order_items
const model2 = db.Sales_wp_order_itemmeta

const wpOrderItemsQueries = {
    monthOrderItems: async(month,year) => {
        const monthOrderItems = await model.findAll({
            where:{
                month:month,
                year:year
            },
            raw:true,
        })
        return monthOrderItems
    },
    createOrderItem: async(newOrderItems) => {
        await model.bulkCreate(newOrderItems)
    },
    getMaxId: async() => {
        const maxId = await model.findOne({
            order: [['order_item_id', 'DESC']],
            raw: true
        })

        return maxId
    },
    getDataToSave: async(firstPostId) => {
        const query = `
                SELECT 
                    oi.order_item_id,
                    oi.order_item_name,
                    oi.order_item_type,
                    oi.order_id as post_id,
                    oi.month,
                    oi.year,
                    oim_qty.meta_value AS quantity,
                    oim_total.meta_value AS total,
                    oim_shipping.meta_value AS shipping,
                    oim_pa_color.meta_value AS color,
                    oim_pa_size.meta_value AS size

                FROM 
                    sales_wp_order_items oi
                LEFT JOIN 
                    sales_wp_order_itemmeta oim_qty
                ON 
                    oi.order_item_id = oim_qty.order_item_id
                AND 
                    oim_qty.meta_key = '_qty'
                LEFT JOIN 
                    sales_wp_order_itemmeta oim_total
                ON 
                    oi.order_item_id = oim_total.order_item_id
                AND 
                    oim_total.meta_key = '_line_total'
                LEFT JOIN 
                    sales_wp_order_itemmeta oim_shipping
                ON 
                    oi.order_item_id = oim_shipping.order_item_id
                AND 
                    oim_shipping.meta_key = 'cost'
                LEFT JOIN 
                    sales_wp_order_itemmeta oim_pa_color
                ON 
                    oi.order_item_id = oim_pa_color.order_item_id
                AND 
                    oim_pa_color.meta_key = 'pa_color'
                LEFT JOIN 
                    sales_wp_order_itemmeta oim_pa_size
                ON 
                    oi.order_item_id = oim_pa_size.order_item_id
                AND 
                    oim_pa_size.meta_key = 'pa_size'
                WHERE 
                    oi.order_id > :firstPostId;
            `;

        const dataToSave = await db.sequelize.query(query, {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: { firstPostId }
        })

        return dataToSave
    },
}       

module.exports = wpOrderItemsQueries