const salesChannelsQueries = require('../dbQueries/data/salesChannelsQueries')

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
    customers: async(req,res) => {
    }
}

module.exports = dataController

