window.addEventListener('load',async()=>{

    for (let i = 0; i < 10; i++) {
        const itemsMenu = document.getElementById('itemsMenu_' + i)
        const subItems = document.getElementById('subItems_' + i)
        if (itemsMenu && subItems) {
            itemsMenu.addEventListener("mouseover",async(e)=>{
                subItems.style.display = "flex"
            })
            itemsMenu.addEventListener("mouseleave",async(e)=>{
                subItems.style.display = "none"
            })
        }
    }
    // }
    
    // ////////////GENERAL DATA MENU////////////
    // const itemsMenu1 = document.getElementById('itemsMenu1')
    // const itemMenu1 = document.getElementById('itemMenu1')
    // const subItems1 = document.getElementById('subItems1')

    // itemMenu1.addEventListener("mouseover",async(e)=>{
    //     subItems1.style.display = "flex"
    // })

    // itemsMenu1.addEventListener("mouseleave",async(e)=>{
    //     subItems1.style.display = "none"
    // })

    // ////////////STATISTICS MENU////////////
    // const itemsMenu3 = document.getElementById('itemsMenu3')
    // const itemMenu3 = document.getElementById('itemMenu3')
    // const subItems3 = document.getElementById('subItems3')

    // itemMenu3.addEventListener("mouseover",async(e)=>{
    //     subItems3.style.display = "flex"
    // })

    // itemsMenu3.addEventListener("mouseleave",async(e)=>{
    //     subItems3.style.display = "none"
    // })
    
    
})




