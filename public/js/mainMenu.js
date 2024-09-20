import {acceptWithEnter, closePopupsEventListeners, inputsValidation} from "./generalFunctions.js"
import { dominio } from "./dominio.js"

window.addEventListener('load',async()=>{

    //complete season
    // let currentSeason = await (await fetch(dominio + 'apis/main/current-season')).json()
    // season.innerText = currentSeason.season

    //close popups
    const closePopups = [chsppClose]
    closePopupsEventListeners(closePopups)

    //change season
    const changeSeason = document.getElementById('changeSeason')

    if (changeSeason) {

        //select change season
        changeSeason.addEventListener("click",async()=>{
            chsppSeason.value = season.innerText
            chspp.style.display = 'block'
        })

        //accept change season
        chsppAccept.addEventListener("click",async()=>{
            const errors = inputsValidation([chsppSeason])

            if (errors == 0) {
                const data = {season:chsppSeason.value}

                await fetch(dominio + 'apis/main/new-season',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })

                season.innerText = data.season

                chspp.style.display = 'none'
            }
        })

        //accept with enter
        acceptWithEnter(chsppSeason,chsppAccept)
    }
})




