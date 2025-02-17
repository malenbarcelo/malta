const gf = {
    
    showTooltips: function(tooltips,top,width) {

        tooltips.forEach(element => {
            const info = document.getElementById(element.icon.id.replace('Icon','Info'))
            element.icon.addEventListener("mouseover", async(e) => {
                info.style.top = top + 'px'
                info.style.right = element.right
                
                info.style.width = width + 'px'
                info.style.display = 'block'
            })
            element.icon.addEventListener("mouseout", async(e) => {
                info.style.display = 'none'
            })
        })
    },
    
}

export { gf }