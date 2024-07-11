const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    price:{
        type: Number,
        required: true
    },
    picture:{
        type:String,
        required:true
    },
    category:{
        type:String,
        require:true
    },
    stock:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    blockStatus:{
        type:Boolean,
        default: false
    }
})
const productModel = mongoose.model('product', productSchema)
module.exports = productModel