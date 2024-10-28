const bottomHeaderMenu = [
    {
        id:1,
        name:'PEDIDOS',
        href:'',
        subitems:[
            {'subitem':'Resumen de pedidos', 'href':'/sales/in-progress-orders'},
            {'subitem':'Detalle de pedidos', 'href':'/sales/in-progress-orders/details'}
        ]
    },
    {
        id:2,
        name:'VENTAS',
        href:'/sales/consolidated',
        subitems:[]
    },
    {
        id:3,
        name:'DATOS',
        href:'',
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

