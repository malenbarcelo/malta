const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col, literal } = require('sequelize')
const model = db.Sales_orders_details

const ordersDetailsQueries = {
    inProgressOrdersDetails: async() => {
        const ordersDetails = await model.findAll({
            include: [
                {
                    association: 'orders_details_orders',
                    where:{
                        enabled:1,
                        [Op.or]: [
                            { id_orders_status: { [Op.ne]: 3 } }
                        ]
                    },
                    include: [
                        {association: 'orders_customers'},
                        {association: 'orders_sales_channels'},
                        {association: 'orders_orders_status'},
                        {association: 'orders_orders_managers'},
                        {association: 'orders_payments_status'}
                    ]
                },
                {
                    association: 'colors',
                    include: [{association: 'color_data'}]
                },
                {
                    association: 'sizes',
                    include: [{association: 'size_data'}]
                },
                {
                    association: 'product_data',
                    include: [
                        {
                            association: 'product_colors',
                            include: [{association: 'color_data'}]
                        },
                        {
                            association: 'product_sizes',
                            include: [{association: 'size_data'}]
                        }
                    ]
                },
             ],
            where:{enabled:1},
            order:[['id_orders','ASC']],
            nest:true,
            //limit:50
        })
        return ordersDetails
    },

    // SELECT sales_orders_details.*, sales_orders.*, data_customers.*, data_sales_channels.*, data_orders_status.*
    // FROM malta_db.sales_orders_details
    // INNER JOIN malta_db.sales_orders ON sales_orders_details.id_orders = sales_orders.id
    // INNER JOIN malta_db.data_customers ON sales_orders.id_customers = data_customers.id
    // INNER JOIN malta_db.data_sales_channels ON sales_orders.id_sales_channels = data_sales_channels.id
    // INNER JOIN malta_db.data_orders_status ON sales_orders.id_orders_status = data_orders_status.id
    // INNER JOIN malta_db.data_orders_managers ON sales_orders.id_orders_managers = data_orders_managers.id
    // INNER JOIN malta_db.data_payments_status ON sales_orders.id_payments_status = data_payments_status.id
    // WHERE sales_orders.enabled = 1 
    // AND sales_orders.id_orders_status != 3;

    cancelOrderDetail: async(lineId,observations) => {        
        await model.update(
            { 
                enabled: 0,
                observations:observations 
            },
            { where: { id: lineId } }
        )
    },
    findOrderDetails: async(idOrders) => {
        const findOrderDetails = await model.findAll({
            where:{
                id_orders:idOrders
            },
            raw:true
        })
        return findOrderDetails
    },
    editOrderDetail: async(lineId,data,observations) => {        
        await model.update(
            { 
                unit_price:data.unit_price,
                required_quantity:data.required_quantity == '' ? null : data.required_quantity,
                confirmed_quantity:data.confirmed_quantity == '' ? null : data.confirmed_quantity,
                extended_price: data.unit_price * (data.confirmed_quantity == '' ? 0 : data.confirmed_quantity),
                observations:observations 
            },
            { where: { id: lineId } }
        )
    },
    editUnitPrice: async(unitPrice,observations,ordersToEdit,idProduct) => {        
        await model.update({ 
                unit_price:unitPrice,
                extended_price: sequelize.literal(`COALESCE(confirmed_quantity, 0) * ${unitPrice}`), 
                observations:observations
            },
            { 
                where: { 
                id_orders: ordersToEdit,
                id_products: idProduct
            }
        })
    },

    delete: async(orderId) => {        
        await model.destroy(
            { where: { id_orders: orderId } }
        )
    },
    updateOrderDetailObs: async(orderDetailId,observations) => {        
        await model.update(
            {
                observations2: observations
             },
            { where: { id: orderDetailId } }
        )
    },
    createOrderDetail: async(detail,orderId) => {

        const newDetail = await model.create({
            id_orders:orderId,
            id_products:detail.id_products,
            description:detail.description,
            color:detail.color,
            size:detail.size,
            unit_price: detail.unit_price,
            required_quantity:detail.required_quantity == '' ? null : detail.required_quantity,
            confirmed_quantity:detail.confirmed_quantity == '' ? null : detail.confirmed_quantity,
            extended_price:detail.extended_price,
            observations2:detail.observations2,
            enabled:1
        })

        return newDetail
    },

    createOrdersDetails: async(ordersDetailsToCreate) => {
        model.bulkCreate(ordersDetailsToCreate)
    },
    get: async({limit,offset,filters}) => {
                    
        // orders details where condition
        const where = {
            enabled:1
        }

        if (filters.id_orders) {
            where.id_orders = filters.id_orders
        }

        if (filters.description) {
            where.description = { [Op.like]: `%${filters.description.toLowerCase()}%` }
        }

        console.log(filters.item_status)

        if (filters.item_status) {
            if (filters.item_status == 1) {
                where.confirmed_quantity = { [Op.or]: ['', null] }
            } else {
                where.confirmed_quantity = { [Op.not]: ['', null] }
            }
        }        
        
        // orders where condition
        const whereOrders = {
            enabled:1,
            id_orders_status: [1,2]
        }

        if (filters.order_number) {
            whereOrders.order_number = filters.order_number
        }

        if (filters.id_orders_status) {
            whereOrders.id_orders_status = filters.id_orders_status
        }

        if (filters.id_sales_channels) {
            whereOrders.id_sales_channels = filters.id_sales_channels
        }

        // customers where condition
        const whereCustomers = {}

        if (filters.customer_name) {
            whereCustomers.customer_name = { [Op.like]: `%${filters.customer_name.toLowerCase()}%` }
        }

        if (filters.item_status) {
            if (filters.item_status == 2) {
                where.confirmed_quantity = { [Op.gte]: 0 }
            } else {
                where.confirmed_quantity = { [Op.or]: { [Op.lt]: 0, [Op.is]: null } }
            }
        }

        const data = await model.findAndCountAll({
            include:[
                {
                    association:'orders_details_orders',
                    attributes:['id','order_number','id_sales_channels', 'id_orders_status','id_customers','discount'],
                    include: [
                        {
                            association: 'orders_customers',
                            where: Object.keys(whereCustomers).length ? whereCustomers : undefined
                        },
                        {association: 'orders_sales_channels'},
                        {association: 'orders_orders_status'},
                        {association: 'orders_orders_managers'},
                        {association: 'orders_payments_status'}
                    ],
                    where:whereOrders
                }
            ],
            where,
            limit,
            offset,
            order:[['id_orders','ASC']],
            raw:true,
            nest:true

        })

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
    create: async(data) => {
        const ordersDetails = model.bulkCreate(data)
        return ordersDetails
    },
}       

module.exports = ordersDetailsQueries

