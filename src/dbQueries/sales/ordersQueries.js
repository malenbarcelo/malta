const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Sales_orders
const Sales_orders_details = db.Sales_orders_details

const ordersQueries = {
    inProgressOrders: async() => {
        const orders = await model.findAll({
            include: [
                {association: 'orders_customers'},
                {association: 'orders_orders_status'},
                {association: 'orders_payments_status'},
                {association: 'orders_orders_managers'},
                {association: 'orders_sales_channels'},
                {association: 'orders_orders_details'},
                {association: 'orders_assignations'}

            ],
            where:{
                enabled:1,
                [Op.or]: [
                    { id_orders_status: { [Op.ne]: 3 } },
                    { id_payments_status: { [Op.ne]: 5 } }
                ]
            },
            order:[['id','ASC']],
            nest:true
        })

        return orders
    },
    inProgressOrdersShowCanceled: async() => {
        const orders = await model.findAll({
            include: [
                {association: 'orders_customers'},
                {association: 'orders_orders_status'},
                {association: 'orders_payments_status'},
                {association: 'orders_orders_managers'},
                {association: 'orders_sales_channels'},
                {
                    association: 'orders_orders_details',
                    include: [
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
                        {
                            association: 'colors',
                            include: [{association: 'color_data'}]
                        },
                        {
                            association: 'sizes',
                            include: [{association: 'size_data'}]
                        }
                    ]

                },
                {association: 'orders_assignations'}

            ],
            where:{
                [Op.or]: [
                    { id_orders_status: { [Op.ne]: 3 } },
                    { id_payments_status: { [Op.ne]: 5 } }
                ]
            },
            order:[['id','ASC']],
            nest:true
        })
        return orders
    },
    findOrder: async(orderId) => {
        const orders = await model.findOne({
            include: [
                {association: 'orders_customers'},
                {association: 'orders_orders_status'},
                {association: 'orders_payments_status'},
                {association: 'orders_orders_managers'},
                {association: 'orders_assignations'},
                {association: 'orders_sales_channels'},
                {association: 'orders_orders_details'}

            ],
            where:{
                id:orderId
            },
            nest:true,
        })
        return orders
    },
    findOrdersByProducts: async (idProduct) => {
        const orders = await model.findAll({
            attributes:[['id','id']],
            include: [
                { 
                    association: 'orders_orders_details',
                    where:{
                        id_products: idProduct
                    }
                }
            ],
            where: {
                [Op.and]: [
                    { id_orders_status: { [Op.ne]: 3 } },
                    { id_payments_status: { [Op.ne]: 5 } }
                ]
            },
            nest: true,
        });
        return orders;
    },
    findCustomerOrders: async(idCustomer,dateFrom) => {
        const orders = await model.findAll({
            attributes: ['date','total','order_number',[sequelize.literal("'PEDIDO'"), 'type'],[sequelize.literal("1"), 'type_number']],            
            where: {
                id_customers:idCustomer,
                enabled:1,
                [Op.and]: [
                    sequelize.where(
                        fn('DATE', col('date')),
                        {
                            [Op.gt]: new Date(dateFrom)
                        }
                    )
                ]
            },
            order:[['date','ASC']],
            raw:true,
        })
        return orders
    },
    newOrder: async() => {
        const maxOrderNumber = await model.max('order_number', {
            where: {id_sales_channels: [1, 2]}
        })

        const newOrderNumber = maxOrderNumber + 1

        return newOrderNumber
    },
    filterOrder: async(orderNumber) => {
        const order = await model.findOne({
            where: {order_number:orderNumber},
            raw:true,
        })

        return order
    },
    createOrder: async(data) => {
        
        const date = new Date()

        //create order
        const newOrder = await model.create({
            date:date,
            order_number:data.order_number,
            id_sales_channels:data.id_sales_channels,
            id_customers:data.id_customers,
            subtotal:data.subtotal,
            discount:data.discount,
            total:data.total,
            id_orders_status:data.id_orders_status,
            id_payments_status:3,
            id_orders_managers:data.id_orders_managers,            
            observations:data.observations,
            season:data.season,
            enabled:1
        })

        return newOrder
    },
    createOrders: async(ordersToreate) => {
        const orders = model.bulkCreate(ordersToreate)
        return orders
    },
    lastId: async() => {
        const lastId = await model.findOne({
            attributes: [[sequelize.fn('max', sequelize.col('id')), 'id']]
          })

          return lastId.id
    },
    deliverOrder: async(orderId,date) => {        
        await model.update(
            { 
                id_orders_status: 3,
                shipping_date: date
            },
            { where: { id: orderId } }
        )
    },
    assignOrderManager: async(orderId,orderManagerId) => {
        await model.update(
            {
                id_orders_managers:orderManagerId
            },
            {
                where:{id:orderId}
            }
        )
    },
    cancelOrder: async(orderId) => {        
        await model.update(
            { enabled: 0 },
            { where: { id: orderId } }
        )
    },
    restoreOrder: async(orderId) => {        
        await model.update(
            { enabled: 1 },
            { where: { id: orderId } }
        )
    },
    setPaymentVerification: async(orderId) => {        
        await model.update(
            { id_payments_status: 6 },
            { where: { id: orderId } }
        )
    },
    updatePaymentsStatusById: async(idOrders,idPaymentsStatus) => {
        await model.update(
            { id_payments_status: idPaymentsStatus },
            { where: { id: idOrders } }
        )
    },
    updateOrderStatus: async(idOrders,idOrderStatus) => {

        await model.update(
            { id_orders_status: idOrderStatus },
            { where: { id: idOrders } }
        )
    },
    webAndDifSales: async(iDate,fDate) => {
        const webAndDifSales = await model.findAll({
            include: [
                {association: 'orders_customers'},
                {association: 'orders_sales_channels'}

            ],
            where:{
                enabled:1,
                id_orders_status:3,
                date: {
                    [Op.between]: [iDate,fDate]
                }
                
            },
            order:[['date','ASC'],['id','ASC']],
            nest:true
        })
        return webAndDifSales
    },
    updateOrderTotal: async(orderId,newSubtotal,newTotal) => {        
        await model.update(
            {
                subtotal: newSubtotal,
                total: newTotal,
             },
            { where: { id: orderId } }
        )
    },
    updateOrder: async(orderId,data) => {        
        await model.update(
            {
                subtotal: data.subtotal,
                discount:data.discount,                
                total: data.total,
                id_orders_status:data.id_orders_status,
             },
            { where: { id: orderId } }
        )
    },
    updateOrderObs: async(orderId,observations) => {        
        await model.update(
            {
                observations: observations
             },
            { where: { id: orderId } }
        )
    },
    inProgressOrdersClients: async() => {
        const orders = await model.findAll({
            attributes: ['id_customers'],
            where:{
                enabled:1,
                [Op.or]: [
                    { id_payments_status: { [Op.ne]: 5 } }
                ]
            },
            include: [
                {association: 'orders_customers'},
            ],
            raw:true,
            nest:true,
            group: ['id_customers']
        })

        return orders
    },
    notShippedOrders: async() => {
        const orders = await model.findAll({
            where:{
                enabled:1,
                id_orders_status: 2
            },
            include: [
                {association: 'orders_customers'},
                {association: 'orders_payments_status'},
                {association: 'orders_assignations'},
                {association: 'shipping_method_data'},
            ],
            nest:true,
        })

        return orders
    },
    update: async(orderId,data) => {        
        await model.update(data, {
            where: {
                id: orderId
            }
        });
    },
    bulkUpdate: async(data) => {        
        for (const d of data) {
            await model.update(
            d, 
            { where: { id: d.id } }
            )
        }
    },
}       

module.exports = ordersQueries

