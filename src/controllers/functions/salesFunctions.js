const ordersQueries = require('../dbQueries/sales/ordersQueries')
const ordersDetailsQueries = require('../dbQueries/sales/ordersDetailsQueries')
const paymentsQueries = require('../dbQueries/sales/paymentsQueries')

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
    orderPayments = orderData.get({ plain: true }).orders_payments
    const totalPayment = orderPayments.reduce((sum, payment) => sum + parseFloat(payment.amount,2), 0)

    if (idPaymentsStatus == 4) {
        if (totalPayment == newTotal) {
            newIdPaymentsStatus = 5
        }
        if (totalPayment > newTotal) {
            newIdPaymentsStatus = 5
            paymentAmount = totalPayment - newTotal
        }        
    }

    if (idPaymentsStatus == 5 || idPaymentsStatus == 6) {
        if (newTotal > total) {
            
            newIdPaymentsStatus = 4
        }
        if (newTotal < total) {
            paymentAmount = total - newTotal
            console.log(total)
            console.log(newTotal)
            console.log(paymentAmount)
            
        } 
    }

    await ordersQueries.updatePaymentsStatusById(idOrders,newIdPaymentsStatus)

    //register order payment if necessary
    if (paymentAmount != 0) {
        await paymentsQueries.registerOrderPayment(idOrders,orderData.id_customers,-paymentAmount,5)
        await paymentsQueries.registerOrderPayment(null,orderData.id_customers,paymentAmount,5)
    }

    
}

module.exports = {updateOrderData, updateOrderStatus,updatePaymentStatus}
