const bottomHeaderMenu = [
    {
        id:1,
        name:'PEDIDOS',
        href:'/sales/in-progress-orders',
        subitems:[
            {'subitem':'DIFUSIÓN', 'href':'/sales/in-progress-orders'},
            {'subitem':'WEB', 'href':'/sales/in-progress-orders/web'}
        ]
    },
    {
        id:2,
        name:'DETALLE DE PEDIDOS',
        href:'/sales/in-progress-orders/details',
        subitems:[
            {'subitem':'DIFUSIÓN', 'href':'/sales/in-progress-orders/details'},
            {'subitem':'WEB', 'href':'/sales/in-progress-orders/details/web'}
        ]
    },
    {
        id:3,
        name:'SEGUIMIENTO',
        href:'/sales/shipping',
        subitems:[
            {'subitem':'DIFUSIÓN', 'href':'/sales/shipping'},
            {'subitem':'WEB', 'href':'/sales/shipping/web'},
        ]
    },
    // {
    //     id:2,
    //     name:'VENTAS',
    //     href:'/sales/consolidated',
    //     subitems:[]
    // },
    {
        id:4,
        name:'DATOS',
        href:'/sales/customers',
        subitems:[
            {'subitem':'CLIENTES', 'href':'/sales/customers'},
            {'subitem':'FORMAS DE PAGO', 'href':'/sales/payment-methods'},
            {'subitem':'PRODUCTOS', 'href':'/sales/products'},
            
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

