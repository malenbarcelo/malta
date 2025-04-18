const fs = require('fs')
const path = require('path')
const { imageSize } = require('image-size')

const printPdfFunctions = {
    drawLayersHeader: (doc, currentY, startX, tableColumnWidths, rowHeight) => {
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

        return currentY;
    },
    drawLayersContent: (doc, currentY, startX, tableColumnWidths, rowHeight, layers) => {
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
    },
    drawSummaryHeader: (doc, currentYSummary, startXsummary, tableSummaryColumnWidths, rowHeight) => {
        let currentX = startXsummary;
        const headerData = ['#CORTE', 'CAPAS', 'BASE', '%','PRENDAS', 'KGS/MTS'];

        headerData.forEach((headerCell, colIndex) => {
            const cellWidth = tableSummaryColumnWidths[colIndex]
            // Draw header background
            
            doc.rect(currentX, currentYSummary, cellWidth, rowHeight)
                .fillColor('#AFABAB')
                .fill();

            // Add header text
            doc.fillColor('black')
            .font('Helvetica-Bold')
            .fontSize(9);
            
            const cellHeight = rowHeight
            const textY = currentYSummary + (cellHeight / 2) - 3

            doc.text(headerCell, currentX, textY, {
                width: cellWidth,
                align: 'center',
                lineBreak: false,
            });

            // Draw header border
            doc.rect(currentX, currentYSummary, cellWidth, rowHeight).strokeColor('black').lineWidth(0.5).stroke();

            currentX += cellWidth;
        });

        currentYSummary += rowHeight;

        return currentYSummary
    },
    drawSummaryContent: (doc, currentYSummary, startXsummary, tableSummaryColumnWidths, rowHeight,cuttings) => {
        cuttings.forEach((row, rowIndex) => {
            let currentX = startXsummary;

            if (currentYSummary > doc.page.height - 50) {
                doc.addPage();
                currentYSummary = 50;
                drawHeader();
            }

            row.forEach((cell, colIndex) => {
                const cellContent = cell !== null && cell !== undefined ? String(cell) : '';

                // Draw row background
                doc.rect(currentX, currentYSummary, tableSummaryColumnWidths[colIndex], rowHeight)
                    .fillColor('white')
                    .fill();

                // Add row text
                doc.fillColor('black')
                .font('Helvetica')
                .fontSize(8);

                const cellWidth = tableSummaryColumnWidths[colIndex]
                const cellHeight = rowHeight
                const textY = currentYSummary + (cellHeight / 2) - 3

                doc.text(cellContent, currentX, textY, {
                    width: cellWidth,
                    align: 'center',
                    lineBreak: false,
                });

                // Draw cell border
                doc.rect(currentX, currentYSummary, cellWidth, rowHeight).strokeColor('black').lineWidth(0.5).stroke();

                currentX += cellWidth;
            });

            currentYSummary += rowHeight;
        });
    },
    drawPageLayers:(doc, idLayers, data) => {
        
        // main title
        doc.font('Helvetica-Bold').fontSize(16).text('DETALLE DEL CORTE #' + data.cutting.cutting + ' (' + data.cutting.mold_data.mold + ')', { align: 'center' })

        // set data
        const rowHeight = 15
        const tableColumnWidths = [40, 120, 80, 80]
        const tableWidth = tableColumnWidths.reduce((a, b) => a + b, 0)
        const startX = (doc.page.width - tableWidth) / 2
        const startY = 85
        let currentY = startY

        // get layers data and prepare data to print
        let layers = [];
        data.layers.forEach(element => {
            layers.push([element.position, element.color, element.layers, element.kgs_mts])
        })

        // draw layers header
        currentY = printPdfFunctions.drawLayersHeader(doc, currentY, startX, tableColumnWidths, rowHeight)

        // draw layers content
        printPdfFunctions.drawSummaryContent(doc, currentY, startX, tableColumnWidths, rowHeight, layers)

        // set data for layers summary
        const tableSummaryColumnWidths = [50, 50, 50, 50, 60, 60]            
        const tableSummaryWidth = tableSummaryColumnWidths.reduce((a, b) => a + b, 0)            
        const startXsummary = (doc.page.width - tableSummaryWidth) / 2            
        const startYSummary = 720            
        let currentYSummary = startYSummary;

        // prepare cuttings for table summary
        let cuttings = [];
        const totalLayers = layers.reduce((sum, item) => {
            return sum + (item[2] !== null ? item[2] : 0)
          }, 0)
        const totalBase = data.cuttings.reduce((sum, obj) => sum + obj.base, 0)
        const totalKgsMts = data.cuttings.reduce((sum, obj) => sum + parseFloat(obj.kgs_mts,2), 0)
    
        data.cuttings.forEach(element => {
            const garments = element.base * totalLayers
            const percentage = ((element.base / totalBase) * 100)
            const perc = isNaN(percentage) ? '' : percentage.toFixed(2) + ' %'
            cuttings.push([element.cutting, totalLayers, element.base, perc, garments, element.kgs_mts.toFixed(2)])
        })

        cuttings.push(['TOTAL', totalLayers, totalBase, '100%', totalBase * totalLayers, totalKgsMts.toFixed(2)])

        // draw layers summary header
        currentYSummary = printPdfFunctions.drawSummaryHeader(doc, currentYSummary, startXsummary, tableSummaryColumnWidths, rowHeight)

        // draw layers summary content            
        printPdfFunctions.drawSummaryContent(doc, currentYSummary, startXsummary, tableSummaryColumnWidths, rowHeight,cuttings);

    },
    drawUpperInputs: (doc, startX, startY, labelWidth, valueWidth, cellHeight, element) => {

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
        startY += 45
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
    },
    drawLowerInputs: (doc, startX, startY, labelWidth, valueWidth, cellHeight, element) => {

        // Collareta title
        doc.lineWidth(0.5)
            .rect(startX, startY + (cellHeight), labelWidth, cellHeight)
            .fillAndStroke('#D7D0D0', 'black')

        doc.fillColor('black')
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('COLLARETA', startX + 5, startY + (cellHeight) + (cellHeight / 2) - 3)

        doc.rect(startX + labelWidth, startY + (cellHeight), valueWidth, cellHeight)
            .strokeColor('black').lineWidth(0.5).stroke()

        // Collareta text
        doc.fillColor('black')
            .font('Helvetica')
            .fontSize(10)

        const collaretaText = ''
        const collaretaTextWidth = doc.widthOfString(collaretaText)
        const collaretaX = startX + labelWidth + (valueWidth / 2) - (collaretaTextWidth / 2)

        doc.text(collaretaText, collaretaX, startY + (cellHeight) + (cellHeight / 2) - 3)

        // workshop title
        doc.lineWidth(0.5)
                .rect(startX + labelWidth + valueWidth + 10, startY + (cellHeight), labelWidth, cellHeight)
                .fillAndStroke('#D7D0D0', 'black')                        
    
        doc.fillColor('black')
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('TALLER', startX + labelWidth + valueWidth + 15, startY + (cellHeight) + (cellHeight / 2) - 3)

        doc.rect(startX + labelWidth + valueWidth + 10 + labelWidth, startY + (cellHeight), valueWidth, cellHeight)
            .strokeColor('black').lineWidth(0.5).stroke()

        // workshop text
        doc.fillColor('black')
            .font('Helvetica')
            .fontSize(10)

        const workshopText = ''
        const workshopTextWidth = doc.widthOfString(workshopText)

        const workshopBoxStartX = startX + labelWidth + valueWidth + 10 + labelWidth
        const workshopX = workshopBoxStartX + (valueWidth / 2) - (workshopTextWidth / 2)

        doc.text(workshopText, workshopX, startY + (cellHeight) + (cellHeight / 2) - 3)

        // accesorios title
        startY += 45
        doc.lineWidth(0.5)
            .rect(startX, startY + (cellHeight), labelWidth, cellHeight)
            .fillAndStroke('#D7D0D0', 'black')

        doc.fillColor('black')
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('ACCESORIOS', startX + 5, startY + (cellHeight) + (cellHeight / 2) - 3)

        doc.rect(startX + labelWidth, startY + (cellHeight), valueWidth, cellHeight)
            .strokeColor('black').lineWidth(0.5).stroke()

        // accesorios text
        doc.fillColor('black')
            .font('Helvetica')
            .fontSize(10)

        const accesoriosText = ''
        const accesoriosTextWidth = doc.widthOfString(accesoriosText)
        const accesoriosX = startX + labelWidth + (valueWidth / 2) - (accesoriosTextWidth / 2)

        doc.text(accesoriosText, accesoriosX, startY + (cellHeight) + (cellHeight / 2) - 3)

        // departure date title
        doc.lineWidth(0.5)
                .rect(startX + labelWidth + valueWidth + 10, startY + (cellHeight), labelWidth, cellHeight)
                .fillAndStroke('#D7D0D0', 'black')                        
    
        doc.fillColor('black')
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('FECHA DE SALIDA', startX + labelWidth + valueWidth + 15, startY + (cellHeight) + (cellHeight / 2) - 3)

        doc.rect(startX + labelWidth + valueWidth + 10 + labelWidth, startY + (cellHeight), valueWidth, cellHeight)
            .strokeColor('black').lineWidth(0.5).stroke()

        // departure date text
        doc.fillColor('black')
            .font('Helvetica')
            .fontSize(10)

        const departureText = ''
        const departureTextWidth = doc.widthOfString(departureText)

        const departureBoxStartX = startX + labelWidth + valueWidth + 10 + labelWidth
        const departureX = departureBoxStartX + (valueWidth / 2) - (departureTextWidth / 2)

        doc.text(departureText, departureX, startY + (cellHeight) + (cellHeight / 2) - 3)

        // kgs mts title
        startY += 45
        doc.lineWidth(0.5)
            .rect(startX, startY + (cellHeight), labelWidth, cellHeight)
            .fillAndStroke('#D7D0D0', 'black')

        doc.fillColor('black')
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('KGS/MTS', startX + 5, startY + (cellHeight) + (cellHeight / 2) - 3)

        doc.rect(startX + labelWidth, startY + (cellHeight), valueWidth, cellHeight)
            .strokeColor('black').lineWidth(0.5).stroke()

        // kgs mts text
        doc.fillColor('black')
            .font('Helvetica')
            .fontSize(10)

        const kgsMtsText = String(element.kgs_mts.toFixed(2)) + ' ' + element.fabric_mu
        const kgsMtsTextWidth = doc.widthOfString(kgsMtsText)
        const kgsMtsX = startX + labelWidth + (valueWidth / 2) - (kgsMtsTextWidth / 2)

        doc.text(kgsMtsText, kgsMtsX, startY + (cellHeight) + (cellHeight / 2) - 3)

        // garments title
        doc.lineWidth(0.5)
                .rect(startX + labelWidth + valueWidth + 10, startY + (cellHeight), labelWidth, cellHeight)
                .fillAndStroke('#D7D0D0', 'black')                        
    
        doc.fillColor('black')
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('PRENDAS', startX + labelWidth + valueWidth + 15, startY + (cellHeight) + (cellHeight / 2) - 3)

        doc.rect(startX + labelWidth + valueWidth + 10 + labelWidth, startY + (cellHeight), valueWidth, cellHeight)
            .strokeColor('black').lineWidth(0.5).stroke()

        // garments text
        doc.fillColor('black')
            .font('Helvetica')
            .fontSize(10)

        const garmentsText = String(element.base * element.layers_data.reduce((sum, obj) => sum + obj.layers, 0))
        const garmentsTextWidth = doc.widthOfString(garmentsText)

        const garmentsBoxStartX = startX + labelWidth + valueWidth + 10 + labelWidth
        const garmentsX = garmentsBoxStartX + (valueWidth / 2) - (garmentsTextWidth / 2)

        doc.text(garmentsText, garmentsX, startY + (cellHeight) + (cellHeight / 2) - 3)

        // observations title
        startY += 45
        doc.lineWidth(0.5)
            .rect(startX, startY + (cellHeight), labelWidth, cellHeight)
            .fillAndStroke('#D7D0D0', 'black')

        doc.fillColor('black')
            .font('Helvetica-Bold')
            .fontSize(10)
            .text('OBSERVACIONES', startX + 5, startY + (cellHeight) + (cellHeight / 2) - 3)

        doc.rect(startX + labelWidth, startY + (cellHeight), 389, cellHeight)
            .strokeColor('black').lineWidth(0.5).stroke()

        // observations text
        doc.fillColor('black')
            .font('Helvetica')
            .fontSize(10)

        const obsText = element.cutting_order_obs || ''
        const obsTextWidth = doc.widthOfString(obsText)
        const obsX = startX + labelWidth + (389 / 2) - (obsTextWidth / 2)

        doc.text(obsText, obsX, startY + (cellHeight) + (cellHeight / 2) - 3)
    },
    drawPageCuttingOrder:(doc,cutting, pageWidth) => {
        
        // main title
        doc.font('Helvetica-Bold').fontSize(16).text('ORDEN DE CORTE #' + cutting.cutting + ' (' + cutting.mold_data.mold + ')', { align: 'center' })
        
        // set data
        const startX = 50
        let startY = 70
        const labelWidth = 100
        const valueWidth = 140
        const cellHeight = 30

        // print upper inputs
        printPdfFunctions.drawUpperInputs(doc, startX, startY, labelWidth, valueWidth, cellHeight, cutting)

        // print image
        startY = 205
        doc.font('Helvetica-Bold')
            .fontSize(12)
            .text(cutting.description, 0, startY, { width: pageWidth, align: 'center' })

        if (cutting.mold_data.image) {
            const imagePath = path.resolve(__dirname, '../../public/images/moldsImages/' + cutting.mold_data.image)
            const buffer = fs.readFileSync(imagePath)
            const dimensions = imageSize(buffer)

            const targetHeight = 300
            const scaleFactor = targetHeight / dimensions.height
            const scaledWidth = dimensions.width * scaleFactor

            const x = (pageWidth / 2) - (scaledWidth / 2)

            doc.image(imagePath, x, 235, { height: targetHeight })
            
        }

        // print lower inputs
        startY = 565
        printPdfFunctions.drawLowerInputs(doc, startX, startY, labelWidth, valueWidth, cellHeight, cutting)

    },
}
        

module.exports = printPdfFunctions
