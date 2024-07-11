const orderModel = require("../Models/orderModel");
const PDFDocument = require('pdfkit')
const fs = require('fs')
const d = new Date();
const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

const invoiceGenerator = async (req, res, next) => {
  try {
    const order = await orderModel
      .findById(req.body.orderId)
      .populate("userId")
      .populate("productId");
		const invoice = new PDFDocument({size: 'A6', margin: 20})
		invoice.pipe(fs.createWriteStream(`public/invoice/${order._id}.pdf`))
		invoice.font('Helvetica-Bold').fontSize(15).text("Tax Invoice",{align:'center'}).moveDown(1)
    invoice.fontSize(10).text(`Order ID: ${order._id}`,{align:'left'})
    invoice.font('Helvetica').text(`Order Date: ${order.orderDate}`)
    invoice.text(`Invoice Date: ${date}`).moveDown(1)
    invoice.font('Helvetica-Bold').text(`Billing Address:`)
    invoice.text(`${order.userId.userName}`)
    invoice.font('Helvetica').text(`${order.address}`).moveDown(0.5)
    invoice.text(`Email: ${order.userId.email}`)
    invoice.text(`Phone: ${order.userId.phone}`).moveDown(1)
    invoice.font('Helvetica-Bold').text('Product:')
    invoice.font('Helvetica').text(`${order.productId.name}`)
    invoice.text(`Quantity: ${order.quantity}`)
    invoice.text(`Total Payment: $${order.price}`)
    invoice.text(`Payment Method: ${order.paymentMethod}`).moveDown(2)
    invoice.font('Helvetica-Bold',{align:'center'}).fillColor('blue').text(`SHOP EASE`)







		invoice.end()
    req.invoice = `public/invoice/${order._id}.pdf`
    next()
  } catch (err) {
    console.log(err);
    res.json({
      message: err.message,
      status: false,
    });
  }
};
module.exports = invoiceGenerator;
