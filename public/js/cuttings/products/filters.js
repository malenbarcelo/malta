import { dominio } from "../../dominio.js"
import pg from "./globals.js"

function applyFilters() {

    pg.productsFiltered = pg.products

    //products types
    pg.productsFiltered = filterType.value == '' ? pg.productsFiltered: pg.productsFiltered.filter(p => p.product_type.product_type == filterType.value)

    //product code
    pg.productsFiltered = filterCode.value == '' ? pg.productsFiltered: pg.productsFiltered.filter(p => p.product_code == filterCode.value)

    //description
    pg.productsFiltered = filterDescription.value == '' ? pg.productsFiltered: pg.productsFiltered.filter(p => p.description == filterDescription.value)
}


export {applyFilters}