const generalFunctions = {
    addOneDay: (date) => {

        const getNewMonth = (month, day) => {
            if (month == 12 && day == 31) {
                return 1
            }else{
                if (months30days.includes(month) && day == 30) {
                    return month + 1
                }else{
                    if (months31days.includes(month) && day == 31) {
                        return month + 1
                    }
                    else{
                        if (months28days.includes(month) && (day == 28 || day == 29)) {
                            return month + 1
                        }else{
                            return month
                        }
                    }
                }
            }
        }
        const getNewDay = (month, day) => {
            if (month == 12 && day == 31) {
                return 1
            }else{
                if (months30days.includes(month) && day == 30) {
                    return 1
                }else{
                    if (months31days.includes(month) && day == 31) {
                        return 1
                    }
                    else{
                        if (months28days.includes(month) && (day == 28 || day == 29)) {
                            return 1
                        }else{
                            return day + 1
                        }
                    }
                }
            }
        }

        const months30days = [4,6,9,11]
        const months31days = [1,3,5,7,8,10,12]
        const months28days = [2]

        const dateArray = date.split('/')

        const year = parseInt(dateArray[2])
        const month = parseInt(dateArray[1])
        const day = parseInt(dateArray[0])

        const newYear = (day == 31 && month ==12) ? (year + 1) : year
        const newMonth = getNewMonth(month, day).toString().padStart(2, '0')
        const newDay = getNewDay(month, day).toString().padStart(2, '0')

        const newDate = newDay + '/' + newMonth + '/' + newYear

        return newDate
    },
    getDateString: (date) => {

        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')

        const dateString = day + '/' + month + '/' + year

        return dateString
    }
}
        

module.exports = generalFunctions
