const ordersQueries = require('../dbQueries/sales/ordersQueries')
const ordersDetailsQueries = require('../dbQueries/sales/ordersDetailsQueries')

async function updateOrderData(idOrders) {
    let orderData = await ordersQueries.findOrder(idOrders)
    orderData = orderData.get({ plain: true })
    const orderDetails = orderData.orders_orders_details
    let newSubtotal = 0
    let newTotal

    orderDetails.forEach(detail => {
        newSubtotal += detail.enabled == 1 ? parseFloat(detail.extended_price,2) : 0
    })

    newTotal = newSubtotal * (1 - orderData.discount)

    //update data
    await ordersQueries.updateOrderTotal(orderData.id,newSubtotal,newTotal)

    return newTotal

}

async function updateOrderStatus(idOrders) {

    //get order details
    const orderDetails = await ordersDetailsQueries.findOrderDetails(idOrders)
    let incompleteLines = 0
    let idOrdersStatus = 2

    orderDetails.forEach(detail => {
        if (detail.confirmed_quantity == null && detail.enabled == 1) {
            incompleteLines += 1
        }
    })

    if (incompleteLines > 0) {
        idOrdersStatus = 1
    }

    ordersQueries.updateOrderStatus(idOrders,idOrdersStatus)
    
}
async function updatePaymentStatus(idOrders,idPaymentsStatus,total,newTotal) {

    let newIdPaymentsStatus = idPaymentsStatus
    let paymentAmount = 0
    let orderData = await ordersQueries.findOrder(idOrders)
    orderPayments = orderData.get({ plain: true }).orders_assignations
    const totalPayment = orderPayments.reduce((sum, payment) => sum + parseFloat(payment.amount,2), 0)

    if (totalPayment == newTotal) {
        newIdPaymentsStatus = 5
    }

    if (totalPayment > newTotal) {
        newIdPaymentsStatus = 5
        paymentAmount = totalPayment - newTotal
    }

    if (totalPayment < newTotal) {
        newIdPaymentsStatus = 4
    }

    await ordersQueries.updatePaymentsStatusById(idOrders,newIdPaymentsStatus)

    //register order payment if necessary
    if (paymentAmount != 0) {
        const assignation = {
            date: new Date(),
            type: 'ASIGNACION',
            id_customers:orderData.id_customers,
            id_orders:idOrders,
            amount:-paymentAmount
        }

        await paymentsAssignationsQueries.create(assignation)
    }

    
}

module.exports = {updateOrderData, updateOrderStatus,updatePaymentStatus}
