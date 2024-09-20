const db = require('../../../../database/models')
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
    }
}

module.exports = usersQueries