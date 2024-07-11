const express = require("express");
const router = new express.Router();
const cors = require("cors");
const {
  signup,
  userLogin,
  userProfile,
  editUserProfile,
  getUnblockedProducts,
  productDetails,
  addToCart,
  getCart,
  editCartQty,
  removeCartItem,
  createOrder,
  getUserOrders,
  orderDetails,
  cancelOrder
} = require("../Controllers/userController");
const userAuth = require("../Middlewares/userAuth");

//  post methods
router.post("/signup", signup);
router.post("/login", userLogin);
router.post("/createOrder", userAuth, createOrder);

//GET METHODS
router.get("/profile", userAuth, userProfile);
router.get("/products", getUnblockedProducts);
router.get("/product-details/:id", productDetails);
router.get("/getcart", userAuth, getCart);
router.get('/myorders', userAuth, getUserOrders)
router.get('/order/details/:orderId', userAuth, orderDetails)

//PUT METHODS
router.put("/editprofile", userAuth, editUserProfile);
router.put("/addtocart/:productId", userAuth, addToCart);
router.put("/editcartqty", userAuth, editCartQty);
router.put("/removecartitem/:productId", userAuth, removeCartItem);
router.put('/order/cancel', userAuth, cancelOrder);

module.exports = router;
