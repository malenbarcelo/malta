const PDFDocument = require('pdfkit')
const moldsQueries = require('../../../dbQueries/cuttings/moldsQueries')
const layersQueries = require('../../../dbQueries/cuttings/layersQueries')
const cuttingsQueries = require('../../../dbQueries/cuttings/cuttingsQueries')
const ppdf = require('../../../functions/printPdfFunctions')

const cuttingsController = {    
    predictMolds: async(req,res) =>{
        try{
            const string = req.params.string.toLowerCase()
            const limit = undefined
            const offset = undefined
            const filters = {mold_string: string}
            
            let data = await moldsQueries.get({ limit, offset, filters })
            
            res.status(200).json(data.rows)

        }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
        }
    },
    predictMoldsDescriptions: async(req,res) =>{
        try{
            const string = req.params.string.toLowerCase()
            const limit = undefined
            const offset = undefined
            const filters = {description: string}
            
            let data = await moldsQueries.get({ limit, offset, filters })
            
            res.status(200).json(data.rows)

        }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
        }
    },
    predictCuttingsDescriptions: async(req,res) =>{
        try{
            const string = req.params.string.toLowerCase()
            const limit = undefined
            const offset = undefined
            const filters = {description: string}
            
            let data = await cuttingsQueries.get({ limit, offset, filters })
            
            res.status(200).json(data.rows)

        }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
        }
    },
    maxIdLayers: async(req,res) =>{
        try{
            
            // max id
            const data = await layersQueries.getMaxId()
            
            res.status(200).json(data)

        }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
        }
    },
    maxCuttingNumber: async(req,res) =>{
        try{
            
            // max cutting number
            const data = await cuttingsQueries.getMaxCuttingNumber()
            
            res.status(200).json(data)

        }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
        }
    },
    //print cutting order
    printCuttingOrder: async(req, res) => {
        try {

            // get data from the body
            const data = req.body;
            const cutting = req.body.cutting
            const idLayers = data.layers[0].id_layers

            //Set the response as a downloadable PDF file
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="ORDEN DE CORTE #' + idLayers + '.pdf"');

            // create pdf element
            const doc = new PDFDocument({ margin: 27, size: 'A4' });
            const pageWidth = doc.page.width

            // Connect the generated PDF to the response stream
            doc.pipe(res);

            // print page cutting order
            doc.moveDown(2)
            ppdf.drawPageCuttingOrder(doc,cutting, pageWidth)

            doc.addPage()
            doc.moveDown(2)

            // print page layers
            ppdf.drawPageLayers(doc, idLayers, data)
            
            // end PDF and send response            
            doc.end()

        } catch (error) {
            console.log(error);
            return res.send('An error occurred');
        }
    },
}

module.exports = cuttingsController


