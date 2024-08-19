const db = require('../../../../database/models')
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
}

module.exports = customersQueries