const db = require('../../../../database/models')
const model = db.Seasons

const usersQueries = {
    currentSeason: async() => {
        const season = await model.findOne({
            order: [['id', 'DESC']]
        })
        return season
    },
    create: async(season,idUser) => {
        model.create({
            season:season,
            id_users:idUser
        })
        return season
    }
}

module.exports = usersQueries