
const PDFDocument = require('pdfkit');
const fs = require('fs');

const salesController = {
  //print customer balance
  printCustomerBalance: async(req, res) => {
    try {
        // Extract data from the request body
        const data = req.body;
        const customerName = data.customerData.customer_name;
        const orderNumer = '#' + String(data.orderData.order_number).padStart(5, '0');
        
        // Format subtotal with 2 decimal places
        const subtotal = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(parseFloat(data.orderData.subtotal, 2));
        
        // Format discount as a percentage
        const discount = parseFloat(data.orderData.discount, 2) * 100 + '%';
        
        // Format total with 2 decimal places
        const total = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(parseFloat(data.orderData.total, 2));
        
        // Format amount paid with 2 decimal places
        const amountPaid = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(parseFloat(data.orderData.amountPaid, 2));
        
        // Format balance with 2 decimal places
        const balance = new Intl.NumberFormat('es-AR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(parseFloat(data.orderData.balance, 2));
        
        // Prepare order data for the table
        const orderData = [
            ['SUBTOTAL', String(subtotal)],
            ['DESCUENTO', String(discount)],
            ['TOTAL', String(total)],
            ['PAGADO', String(amountPaid)],
            ['SALDO', String(balance)]
        ];
        
        // Prepare order details for the table
        let orderDetails = [];
        data.orderData.orders_orders_details.forEach(element => {
            if (element.confirmed_quantity != 0) {
                orderDetails.push([element.confirmed_quantity ? String(element.confirmed_quantity) : '', element.description, element.unit_price]);
            }         
        });
        
        // Format unit prices in the order details table
        orderDetails = orderDetails.map(o => {
            const [first, second, third] = o; // Destructure elements
            const formattedThird = new Intl.NumberFormat('es-AR', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(parseFloat(third, 2));
            return [first, second, formattedThird]; // Create a new subarray with formatted unit price
        });

        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        // Set the response as a downloadable PDF file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="' + customerName + ' - ' + orderNumer + '.pdf"');

        // Connect the generated PDF to the response stream
        doc.pipe(res);

        // Add customer and order details to the PDF
        doc.font('Helvetica-Bold').fontSize(16).text(customerName.toUpperCase(), { align: 'center' });
        doc.font('Helvetica').fontSize(12).text('PEDIDO ' + orderNumer, { align: 'center' });
        doc.moveDown();

        // Set data for the order data table (table 1)
        const rowHeightT1 = 17;
        const tableColumnWidthsT1 = [100, 170];
        const tableWidthT1 = tableColumnWidthsT1.reduce((a, b) => a + b, 0);
        const startXT1 = (doc.page.width - tableWidthT1) / 2;
        const startYT1 = 80;
        let currentY = startYT1;

        // Print order data
        orderData.forEach((row, rowIndex) => {
            let currentX = startXT1;

            row.forEach((cell, colIndex) => {
                const cellContent = cell !== null && cell !== undefined ? String(cell) : '';
                const cellWidth = tableColumnWidthsT1[colIndex];

                // Configure font size based on column
                if (colIndex === 0) {
                    doc.font('Helvetica-Bold').fontSize(9); 
                } else if (colIndex === 1) {
                    doc.font('Helvetica').fontSize(8); 
                }

                const textHeight = doc.currentLineHeight();
                const textY = currentY + (rowHeightT1 - textHeight) / 2;

                // Add background color for specific cells
                if (rowIndex === orderData.length - 1) {
                    // Highlight last row
                    if (colIndex === 0) {
                        doc.save()
                            .fillColor('#CF2E2E')
                            .rect(currentX, currentY, cellWidth, rowHeightT1)
                            .fill();
                    } else if (colIndex === 1) {
                        doc.save()
                            .fillColor('#ECAAAA')
                            .rect(currentX, currentY, cellWidth, rowHeightT1)
                            .fill();
                    }
                } else {
                    // Normal rows
                    if (colIndex === 0) {
                        doc.save()
                            .fillColor('#d0d0d0')
                            .rect(currentX, currentY, cellWidth, rowHeightT1)
                            .fill();
                    } else if (colIndex === 1) {
                        doc.save()
                            .fillColor('#f0f0f0')
                            .rect(currentX, currentY, cellWidth, rowHeightT1)
                            .fill();
                    }
                }

                // Draw border
                doc.strokeColor('white')
                    .lineWidth(0.5)
                    .rect(currentX, currentY, cellWidth, rowHeightT1)
                    .stroke();

                // Add cell text
                doc.fillColor('black')
                    .text(cellContent, currentX, textY, {
                        width: cellWidth,
                        align: 'center',
                        lineBreak: false,
                    });

                currentX += cellWidth;
            });

            currentY += rowHeightT1;
        });

        // Set data for the order details table (table 2)
        const rowHeight = 18;
        const tableColumnWidths = [70, 300, 70];
        const tableWidth = tableColumnWidths.reduce((a, b) => a + b, 0);
        const startX = (doc.page.width - tableWidth) / 2;
        const startY = 190;
        currentY = startY;

        // Function to draw table header
        const drawHeader = () => {
            let currentX = startX;
            const headerData = ['Quantity', 'Product', 'Price'];

            headerData.forEach((headerCell, colIndex) => {
                const cellWidth = tableColumnWidths[colIndex];

                // Draw header background
                doc.rect(currentX, currentY, cellWidth, rowHeight)
                    .fillColor('#A6A6A6')
                    .fill();

                // Add header text
                doc.fillColor('black')
                   .font('Helvetica-Bold')
                   .fontSize(9);

                const textHeight = doc.currentLineHeight();
                const textY = currentY + (rowHeight - textHeight) / 2; 
                doc.text(headerCell, currentX, textY, {
                    width: cellWidth,
                    align: 'center',
                    lineBreak: false,
                });

                // Draw header border
                doc.rect(currentX, currentY, cellWidth, rowHeight).strokeColor('#FFFFFF').lineWidth(0.5).stroke();

                currentX += cellWidth;
            });

            currentY += rowHeight;
        };

        // Function to draw table content
        const drawContent = () => {
            orderDetails.forEach((row, rowIndex) => {
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
                        .fillColor('#f0f0f0')
                        .fill();

                    // Add row text
                    doc.fillColor('black')
                       .font('Helvetica')
                       .fontSize(8);

                    const cellWidth = tableColumnWidths[colIndex];
                    const textHeight = doc.currentLineHeight();
                    const textY = currentY + (rowHeight - textHeight) / 2;

                    doc.text(cellContent, currentX, textY, {
                        width: cellWidth,
                        align: 'center',
                        lineBreak: false,
                    });

                    // Draw cell border
                    doc.rect(currentX, currentY, cellWidth, rowHeight).strokeColor('#FFFFFF').lineWidth(0.5).stroke();

                    currentX += cellWidth;
                });

                currentY += rowHeight;
            });
        };

        // Draw table header and content
        currentY = startY;
        drawHeader();
        drawContent();

        // End PDF and send response
        doc.end();

    } catch (error) {
        console.group(error);
        return res.send('An error occurred');
    }
}

  
 
}
module.exports = salesController