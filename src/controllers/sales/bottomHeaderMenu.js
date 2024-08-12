const bottomHeaderMenu = [
    {
        id:1,
        name:'PEDIDOS',
        href:'/sales/in-progress-orders',
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
        name:'CLIENTES',
        href:'/sales/customers',
        subitems:[]
    },
    // {
    //     id:4,
    //     name:'ESTADÍSTICAS',
    //     href:'/sales/statistics/sales',
    //     subitems:[]
    // }
]

module.exports = bottomHeaderMenu

