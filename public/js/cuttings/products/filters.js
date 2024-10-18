import { dominio } from "../../dominio.js"
import pg from "./globals.js"

function applyFilters() {

    pg.productsFiltered = pg.products

    //products types
    pg.productsFiltered = filterType.value == '' ? pg.productsFiltered: pg.productsFiltered.filter(p => p.product_type.product_type.toLowerCase().includes(filterType.value.toLowerCase()))

    //product
    pg.productsFiltered = filterDescription.value == '' ? pg.productsFiltered: pg.productsFiltered.filter(p => p.full_description.toLowerCase().includes(filterDescription.value.toLowerCase()))

}


export {applyFilters}