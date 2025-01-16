const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Data_customers

const customersQueries = {
    customers: async(dateFrom) => {
        const customers = await model.findAll({
            include: [
                {
                    association: 'customers_payments_assignations',
                    where: {
                        date: {
                            [Op.gt]: dateFrom
                        }
                    },
                    required: false
                }
            ],
            order:[['customer_name','ASC']],
            nest:true,
        })
        return customers
    },
    create: async(data) => {
        await model.create(data)
    },
    update: async(newData,id) => {
        await model.update(newData, {
            where: { id: id }
        });
    },
    destroy: async(id) => {
        await model.destroy({
            where: { id }
        });
    },
    postNotes: async(notes,id) => {
        await model.update(
            {
                notes:notes
            },
            {
                where:{
                    id:id
                }
            }
        )
    },
    getDistinct: async () => {
        const data = await model.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('customer_name')), 'customer_name']],
            where: {
                enabled: 1
            },
            order: [['customer_name', 'ASC']],
            raw: true,
        });
        return data
    },
    bulkUpdate: async(data) => {        
        for (const d of data) {
            await model.update(
            d, 
            { where: { id: d.id } }
            )
        }
    },
    get: async() => {
        const data = await model.findAll({
            where:{
                enabled: 1
            },
            order:[['customer_name','ASC']],
            raw:true,
        })
        return data
    },
}

module.exports = customersQueries