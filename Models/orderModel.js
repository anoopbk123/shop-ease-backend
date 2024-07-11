const d = new Date();
const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  userId: {
    required: true,
    type: mongoose.Schema.ObjectId,
    ref: "users",
  },
  productId: {
    required: true,
    type: mongoose.Schema.ObjectId,
    ref: "product",
  },
  quantity: {
    required: true,
    type: Number,
  },
  price: {
    required: true,
    type: Number,
  },
  deliveryStatus: {
    type: String,
    default: 'processing',
    //success, canceled
  },
  orderDate: {
    type: String,
    default: date,
  },
  deliveryDate: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  invoice:{
    type:String,
  },
  paymentMethod:{
    type:String,
    required:true,
  },
  cancelDate:{
    type:String
  }
});
const orderModel = mongoose.model('orders', orderSchema)
module.exports = orderModel
