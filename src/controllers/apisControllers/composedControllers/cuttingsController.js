const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')
const { imageSize } = require('image-size')
const moldsQueries = require('../../../dbQueries/cuttings/moldsQueries')
const layersQueries = require('../../../dbQueries/cuttings/layersQueries')
const cuttingsQueries = require('../../../dbQueries/cuttings/cuttingsQueries')

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
            // Extract data from the request body
            const data = req.body;

            const idLayers = data.layers[0].id_layers
            
            const doc = new PDFDocument({ margin: 27, size: 'A4' });

            //Set the response as a downloadable PDF file
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="ORDEN DE CORTE #' + idLayers + '.pdf"');

            // Connect the generated PDF to the response stream
            doc.pipe(res);

            // title
            doc.font('Helvetica-Bold').fontSize(16).text('ORDEN DE CORTE #' + idLayers, { align: 'center' })
            doc.moveDown()

            // Set data for layers details
            const rowHeight = 15;
            const tableColumnWidths = [40, 120, 80, 80];
            const tableWidth = tableColumnWidths.reduce((a, b) => a + b, 0)
            const startX = (doc.page.width - tableWidth) / 2;
            const startY = 65;
            let currentY = startY;

            // Prepare layers for the table
            let layers = [];
            data.layers.forEach(element => {
                layers.push([element.position, element.color, element.layers, element.kgs_mts])
            })

            // Function to draw table header
            const drawHeader = () => {
                let currentX = startX;
                const headerData = ['#', 'Color', 'Capas','Kgs/Mts'];

                headerData.forEach((headerCell, colIndex) => {
                    const cellWidth = tableColumnWidths[colIndex]
                    // Draw header background
                    doc.rect(currentX, currentY, cellWidth, rowHeight)
                        .fillColor('#AFABAB')
                        .fill();

                    // Add header text
                    doc.fillColor('black')
                    .font('Helvetica-Bold')
                    .fontSize(9);

                    
                    const cellHeight = rowHeight
                    const textY = currentY + (cellHeight / 2) - 3

                    doc.text(headerCell, currentX, textY, {
                        width: cellWidth,
                        align: 'center',
                        lineBreak: false,
                    });

                    // Draw header border
                    doc.rect(currentX, currentY, cellWidth, rowHeight).strokeColor('black').lineWidth(0.5).stroke();

                    currentX += cellWidth;
                });

                currentY += rowHeight;
            };

            // Function to draw table content
            const drawContent = () => {
                layers.forEach((row, rowIndex) => {
                    let currentX = startX;

                    if (currentY > doc.page.height - 50) {
                        doc.addPage();
                        currentY = 50;
                        drawHeader();
                    }

                    row.forEach((cell, colIndex) => {
                        const cellContent = cell !== null && cell !== undefined ? String(cell) : '';

                        // Draw row background
                        doc.rect(currentX, currentY, tableColumnWidths[colIndex], rowHeight)
                            .fillColor('white')
                            .fill();

                        // Add row text
                        doc.fillColor('black')
                        .font('Helvetica')
                        .fontSize(8);

                        const cellWidth = tableColumnWidths[colIndex]
                        const cellHeight = rowHeight
                        const textY = currentY + (cellHeight / 2) - 3

                        doc.text(cellContent, currentX, textY, {
                            width: cellWidth,
                            align: 'center',
                            lineBreak: false,
                        });

                        // Draw cell border
                        doc.rect(currentX, currentY, cellWidth, rowHeight).strokeColor('black').lineWidth(0.5).stroke();

                        currentX += cellWidth;
                    });

                    currentY += rowHeight;
                });
            };

            // Draw table header and content
            currentY = startY;
            drawHeader();
            drawContent();

            // print cutting orders
            const drawUpperInputs = (doc, startX, startY, labelWidth, valueWidth, cellHeight, element) => {

                // Cutting title
                doc.lineWidth(0.5)
                    .rect(startX, startY + (cellHeight), labelWidth, cellHeight)
                    .fillAndStroke('#D7D0D0', 'black')

                doc.fillColor('black')
                    .font('Helvetica-Bold')
                    .fontSize(10)
                    .text('#CORTE', startX + 5, startY + (cellHeight) + (cellHeight / 2) - 3)

                doc.rect(startX + labelWidth, startY + (cellHeight), valueWidth, cellHeight)
                    .strokeColor('black').lineWidth(0.5).stroke()

                // Cutting text
                doc.fillColor('black')
                    .font('Helvetica')
                    .fontSize(10)

                const cuttingText = String(element.cutting ?? '')
                const cuttingTextWidth = doc.widthOfString(cuttingText)
                const cuttingX = startX + labelWidth + (valueWidth / 2) - (cuttingTextWidth / 2)

                doc.text(cuttingText, cuttingX, startY + (cellHeight) + (cellHeight / 2) - 3)

                // date title
                doc.lineWidth(0.5)
                        .rect(startX + labelWidth + valueWidth + 10, startY + (cellHeight), labelWidth, cellHeight)
                        .fillAndStroke('#D7D0D0', 'black')                        
            
                doc.fillColor('black')
                    .font('Helvetica-Bold')
                    .fontSize(10)
                    .text('FECHA', startX + labelWidth + valueWidth + 15, startY + (cellHeight) + (cellHeight / 2) - 3)

                doc.rect(startX + labelWidth + valueWidth + 10 + labelWidth, startY + (cellHeight), valueWidth, cellHeight)
                    .strokeColor('black').lineWidth(0.5).stroke()

                // date text
                doc.fillColor('black')
                    .font('Helvetica')
                    .fontSize(10)

                const dateArray = element.date.split('-')
                const dateText = String(dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0])
                const dateTextWidth = doc.widthOfString(dateText)

                const dateBoxStartX = startX + labelWidth + valueWidth + 10 + labelWidth
                const dateX = dateBoxStartX + (valueWidth / 2) - (dateTextWidth / 2)

                doc.text(dateText, dateX, startY + (cellHeight) + (cellHeight / 2) - 3)

                // mold title
                startY += 35
                doc.lineWidth(0.5)
                    .rect(startX, startY + (cellHeight), labelWidth, cellHeight)
                    .fillAndStroke('#D7D0D0', 'black')

                doc.fillColor('black')
                    .font('Helvetica-Bold')
                    .fontSize(10)
                    .text('MODELO', startX + 5, startY + (cellHeight) + (cellHeight / 2) - 3)

                doc.rect(startX + labelWidth, startY + (cellHeight), valueWidth, cellHeight)
                    .strokeColor('black').lineWidth(0.5).stroke()

                // mold text
                doc.fillColor('black')
                    .font('Helvetica')
                    .fontSize(10)

                const moldText = String(element.mold_data.mold ?? '')
                const moldTextWidth = doc.widthOfString(moldText)
                const moldX = startX + labelWidth + (valueWidth / 2) - (moldTextWidth / 2)

                doc.text(moldText, moldX, startY + (cellHeight) + (cellHeight / 2) - 3)

                // fabric title
                doc.lineWidth(0.5)
                        .rect(startX + labelWidth + valueWidth + 10, startY + (cellHeight), labelWidth, cellHeight)
                        .fillAndStroke('#D7D0D0', 'black')                        
            
                doc.fillColor('black')
                    .font('Helvetica-Bold')
                    .fontSize(10)
                    .text('TELA', startX + labelWidth + valueWidth + 15, startY + (cellHeight) + (cellHeight / 2) - 3)

                doc.rect(startX + labelWidth + valueWidth + 10 + labelWidth, startY + (cellHeight), valueWidth, cellHeight)
                    .strokeColor('black').lineWidth(0.5).stroke()

                // fabric text
                doc.fillColor('black')
                    .font('Helvetica')
                    .fontSize(10)

                const fabricText = ''
                const fabricTextWidth = doc.widthOfString(fabricText)

                const fabricBoxStartX = startX + labelWidth + valueWidth + 10 + labelWidth
                const fabricX = fabricBoxStartX + (valueWidth / 2) - (fabricTextWidth / 2)

                doc.text(fabricText, fabricX, startY + (cellHeight) + (cellHeight / 2) - 3)

                
            }
            

            const pageWidth = doc.page.width

            data.cuttings.forEach(element => {

                doc.addPage()            
                doc.font('Helvetica-Bold').fontSize(14).text('CORTE #' + element.cutting + ' (' + element.mold_data.mold + ')', { align: 'center' })
                doc.moveDown()
            
                const startX = 50
                let startY = 35
                const labelWidth = 80
                const valueWidth = 160
                const cellHeight = 30
            
                drawUpperInputs(doc, startX, startY, labelWidth, valueWidth, cellHeight, element)

                startY = 170
                
                doc.font('Helvetica-Bold')
                    .fontSize(12)
                    .text(element.description, 0, startY, { width: pageWidth, align: 'center' })

                startY = 170

                // mold image
                const imagePath = path.resolve(__dirname, './public/images/moldsImages/1741697235104.jpeg')
                const buffer = fs.readFileSync(imagePath)
                const dimensions = imageSize(buffer)

                console.log('DIMENSIONS:', dimensions)

                const targetHeight = 250
                const scaleFactor = targetHeight / dimensions.height
                const scaledWidth = dimensions.width * scaleFactor

                const x = (pageWidth / 2) - (scaledWidth / 2)

                doc.image(imagePath, x, 200, { height: targetHeight })

                
            })
            

            

            // End PDF and send response
            doc.end()

        } catch (error) {
            console.log(error);
            return res.send('An error occurred');
        }
    },
}

module.exports = cuttingsController


