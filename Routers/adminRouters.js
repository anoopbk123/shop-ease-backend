const express = require('express')
const adminRouter = new express.Router()
const {adminLogin, userList, updateUserBlockStatus, createProduct, getProducts, updateProductBlockStatus, editProduct, getOrders, orderDetails, confirmDelivery} = require('../Controllers/adminController')
const adminAuth = require('../Middlewares/adminAuth')
const createMulterInstance = require('../Middlewares/multer')
const invoiceGenerator = require('../Middlewares/invoiceGenerator')
const uploadProductPicture = createMulterInstance('products')

//POST METHODS
//login
adminRouter.post('/login', adminLogin)
//product create
adminRouter.post('/create-product',adminAuth, uploadProductPicture.single('picture'), createProduct)

//GET METHODS
adminRouter.get('/users', adminAuth, userList)
adminRouter.get('/products', adminAuth, getProducts)
adminRouter.get('/orders', adminAuth, getOrders)
adminRouter.get('/order/details/:orderId', adminAuth, orderDetails)

//PUT METHODS
adminRouter.put('/edit-product', adminAuth, editProduct)
adminRouter.put('/update-user-block', adminAuth, updateUserBlockStatus)
adminRouter.put('/update-product-block', adminAuth, updateProductBlockStatus)
adminRouter.put('/delivery/confirm', adminAuth, invoiceGenerator, confirmDelivery)

module.exports = adminRouter