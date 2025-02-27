const db = require('../../../database/models')
const model = db.Users

const usersQueries = {
    findUser: async(user) => {
        const foundUser = await model.findOne({
            where:{
                user:user
            },
            include: [
                {
                    association: 'user_category',
                    include:[{association:'category_permissions'}]
                }
            ],
            nest:true
        })
        return foundUser
    },
    get: async() => {
    
            const data = await model.findAll({
                include: [{
                    association: 'sales_channel',
                    association: 'user_category',
                }],
                where:{enabled:1},
                raw:true,
                nest:true,
                order: [['first_name', 'ASC']],
            })
    
            return data
        },
}

module.exports = usersQueries