const bottomHeaderMenu = [
    {
        'name':'VENTAS',
        'href':'/sales'
    },
    {
        'name':'CORTES',
        'href':'/cuttings'
    },
    {
        'name':'FINANZAS',
        'href':'/finances'
    },
]

const dataController = {
    sales: (req,res) => {
        try{
            
            return res.redirect('/data/sales/cutomers')

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    customers: (req,res) => {
        try{
            
            const selectedItem = 'VENTAS'
            
            return res.render('data/customers',{title:'Clientes',bottomHeaderMenu,selectedItem})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = dataController

