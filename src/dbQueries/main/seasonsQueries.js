const db = require('../../../database/models')
const model = db.Seasons

const seasonQueries = {
    currentSeason: async() => {
        const season = await model.findOne({
            order: [['id', 'DESC']],
            raw:true
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

module.exports = seasonQueries