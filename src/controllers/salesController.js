const customersQueries = require('../dbQueries/data/customersQueries')
const ordersManagersQueries = require('../dbQueries/data/ordersManagersQueries')
const salesChannelsQueries = require('../dbQueries/data/salesChannelsQueries')
const ordersStatusQueries = require('../dbQueries/data/ordersStatusQueries')
const paymentsStatusQueries = require('../dbQueries/data/paymentsStatusQueries')
const paymentMethodsQueries = require('../dbQueries/data/paymentMethodsQueries')
const productsQueries = require('../dbQueries/cuttings/productsQueries')
const ordersQueries = require('../dbQueries/sales/ordersQueries')
const bottomHeaderMenu = require("./sales/bottomHeaderMenu")

const salesController = {
    inProgressOrders: async(req,res) => {
        try{

            const selectedItem = 'PEDIDOS'
            const customers = await customersQueries.customers()
            const ordersManagers = await ordersManagersQueries.ordersManagers()
            const paymentMethods = await paymentMethodsQueries.paymentMethods()
            const ordersStatus = await ordersStatusQueries.ordersStatus()
            const paymentsStatus = await paymentsStatusQueries.paymentsStatus()
            const distinctProducts = await productsQueries.distinctProducts()
            const orders = await ordersQueries.inProgressOrders()

            return res.render('sales/orders/orders',{title:'Pedidos',bottomHeaderMenu,selectedItem,customers,ordersManagers,ordersStatus,paymentsStatus,distinctProducts,orders,paymentMethods})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    inProgressOrdersDetails: async(req,res) => {
        try{

            const selectedItem = 'DETALLE DE PEDIDOS'
            const customers = await customersQueries.customers()
            const ordersManagers = await ordersManagersQueries.ordersManagers()
            const ordersStatus = await ordersStatusQueries.ordersStatus()
            const distinctProducts = await productsQueries.distinctProducts()
            const orders = await ordersQueries.inProgressOrders()

            return res.render('sales/ordersDetails/ordersDetails',{title:'Detalle de pedidos',bottomHeaderMenu,selectedItem,customers,ordersManagers,ordersStatus,distinctProducts,orders})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    sales: async(req,res) => {
        try{

            let date = new Date()
            const year = date.getFullYear()

            const selectedItem = 'VENTAS'
            const customers = await customersQueries.customers()
            const salesChannels = await salesChannelsQueries.salesChannels()
            const months = [
                {id:1,month:'Enero'},
                {id:2,month:'Febrero'},
                {id:3,month:'Marzo'},
                {id:4,month:'Abril'},
                {id:5,month:'Mayo'},
                {id:6,month:'Junio'},
                {id:7,month:'Julio'},
                {id:8,month:'Agosto'},
                {id:9,month:'Septiembre'},
                {id:10,month:'Octubre'},
                {id:11,month:'Noviembre'},
                {id:12,month:'Diciembre'},
            ]

            return res.render('sales/sales/sales',{title:'Ventas',bottomHeaderMenu,selectedItem,customers,year,salesChannels,months})
            
        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    customers: async(req,res) => {
        try{
            const selectedItem = 'DATOS'
            
            return res.render('sales/customers/customers',{title:'Clientes',bottomHeaderMenu,selectedItem})
            
        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    paymentMethods: async(req,res) => {
        try{
            const selectedItem = 'DATOS'
            
            return res.render('sales/paymentMethods/paymentMethods',{title:'Métodos de pago',bottomHeaderMenu,selectedItem})
            
        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    salesStatistics: (req,res) => {
        try{

            const selectedItem = 'ESTADÍSTICAS'

            return res.render('sales/salesStatistics',{title:'Estadísticas',bottomHeaderMenu,selectedItem})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = salesController

