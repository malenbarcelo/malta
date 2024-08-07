const db = require('../../../../database/models')
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
                {association: 'orders_payments'},
                {association: 'orders_accounts_movements'},
                {association: 'orders_sales_channels'},
                {association: 'orders_orders_details'}

            ],
            where:{
                enabled:1,
                [Op.or]: [
                    { id_orders_status: { [Op.ne]: 3 } },
                    { id_payments_status: { [Op.ne]: 5 } }
                ]
            },
            order:[['date','ASC'],['id','ASC']],
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
                {association: 'orders_payments'},
                {association: 'orders_accounts_movements'},
                {association: 'orders_sales_channels'}

            ],
            where:{
                [Op.or]: [
                    { id_orders_status: { [Op.ne]: 3 } },
                    { id_payments_status: { [Op.ne]: 5 } }
                ]
            },
            order:[['date','ASC'],['id','ASC']],
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
                {association: 'orders_payments'},
                {association: 'orders_accounts_movements'},
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
        await model.create({
            date:date,
            order_number:data.order_number,
            id_sales_channels:data.id_sales_channels,
            id_customers:data.id_customers,
            subtotal:data.subtotal,
            discount:data.discount,
            total:data.total,
            id_orders_status:data.id_orders_status,
            id_payments_status:3,
            id_orders_managers:1,            
            observations:data.observations,
            enabled:1
        })
    },
    createOrders: async(ordersToreate) => {
        model.bulkCreate(ordersToreate)
    },
    createOrderDetails: async(data,orderId) => {

        const orderDetails = data.order_details

        for (let i = 0; i < orderDetails.length; i++) {
            //create row
            await Sales_orders_details.create({
                id_orders:orderId,
                id_products:orderDetails[i].id_products,
                description:orderDetails[i].description,
                color:orderDetails[i].color,
                size:orderDetails[i].size,
                unit_price: orderDetails[i].unit_price,
                required_quantity:orderDetails[i].required_quantity == '' ? null : orderDetails[i].required_quantity,
                confirmed_quantity:orderDetails[i].confirmed_quantity == '' ? null : orderDetails[i].confirmed_quantity,
                extended_price:orderDetails[i].extended_price,
                enabled:1
            })            
        }        
    },
    
    lastId: async() => {
        const lastId = await model.findOne({
            attributes: [[sequelize.fn('max', sequelize.col('id')), 'id']]
          })

          return lastId.id
    },
    deliverOrder: async(orderId) => {        
        await model.update(
            { id_orders_status: 3 },
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
    updatePaymentsStatus: async(orderId) => {

        let amountPaidPayments = 0
        let amountPaidAccounts = 0
        let amountPaid = 0

        let idPaymentsStatus = 3

        //find order data
        const orderToUpdate = await model.findOne({
            where:{id:orderId},
            include: [
                {association: 'orders_payments'},
                {association: 'orders_accounts_movements'}
            ],
            nest:true,
        })

        //sum order payments
        orderToUpdate.orders_payments.forEach(payment => {
            amountPaidPayments += parseFloat(payment.amount,2)
        })

        //sum order account movements
        orderToUpdate.orders_accounts_movements.forEach(movement => {
            amountPaidAccounts += parseFloat(movement.amount,2)
        })

        amountPaid = amountPaidPayments + amountPaidAccounts

        idPaymentsStatus = ((amountPaid < orderToUpdate.total && amountPaid > 0) || orderToUpdate.id_orders_status == 1) ? 4 : 5
        
        await model.update(
            { id_payments_status: idPaymentsStatus },
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
}       

module.exports = ordersQueries

