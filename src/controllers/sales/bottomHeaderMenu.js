const bottomHeaderMenu = [
    {
        id:1,
        name:'PEDIDOS',
        href:'/sales/in-progress-orders',
        subitems:[]
    },
    {
        id:2,
        name:'DETALLE DE PEDIDOS',
        href:'/sales/in-progress-orders/details',
        subitems:[]
    },
    // {
    //     id:2,
    //     name:'VENTAS',
    //     href:'/sales/consolidated',
    //     subitems:[]
    // },
    {
        id:3,
        name:'DATOS',
        href:'/sales/customers',
        subitems:[
            {'subitem':'Clientes', 'href':'/sales/customers'},
            {'subitem':'Formas de pago', 'href':'/sales/payment-methods'}
        ]
    },
    
    // {
    //     id:4,
    //     name:'ESTADÍSTICAS',
    //     href:'/sales/statistics/sales',
    //     subitems:[]
    // }
]

module.exports = bottomHeaderMenu

