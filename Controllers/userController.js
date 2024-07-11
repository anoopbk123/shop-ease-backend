const userModel = require("../Models/userModel");
const d = new Date();
const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const productModel = require("../Models/productModel");
const orderModel = require("../Models/orderModel");
const maxAge = 60 * 60 * 24 * 3;
require("dotenv").config();

//jwt creation
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};
//|| POST METHODS
//signup
module.exports.signup = async (req, res, next) => {
  const { userName, email, password, phone, address } = req.body;
  try {
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
      // console.log(email);
      return res.json({
        message: "Email already exists, please login",
        status: false,
      });
    }
    const newUser = new userModel({
      userName,
      email,
      phone,
      password,
      address,
    });
    const userDetails = await newUser.save();
    return res.json({
      message: "Account created successfully",
      status: true,
      // token
    });
  } catch (err) {
    console.log(err);
    return res.json({
      message: "internal server error",
      status: false,
    });
  }
};
//login
module.exports.userLogin = async (req, res, next) => {
  const { email, password: loginPassword } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      if (user.blockStatus) {
        return res.json({
          status: false,
          message: "you are temporally blocked by admin",
        });
      } else {
        const passwordMatch = await bcrypt.compare(
          loginPassword,
          user.password
        );
        if (passwordMatch) {
          const token = createToken(user._id);
          return res.json({
            message: "Login success",
            // user,
            token,
            status: true,
          });
        } else {
          return res.json({
            message: "password is not matching",
            status: false,
          });
        }
      }
    } else {
      return res.json({
        message: "Login failed user not found",
        status: false,
      });
    }
  } catch (err) {
    res.json({
      message: err,
      status: false,
    });
  }
};

//POST ORDER
module.exports.createOrder = async (req, res) => {
  try {
    const { productId, paymentMethod, } = req.body;
    const price = Number(req.body.price);
    const quantity = parseInt(req.body.quantity);
    const userId = req.user._id;
    const address = req.user.address
    const newOrder = new orderModel({
      productId,
      paymentMethod,
      address,
      price,
      quantity,
      userId,
    });
    const savedOrder = await newOrder.save()
    if(savedOrder){
      const product = await productModel.findById(productId)
      product.stock = product.stock - quantity
      await product.save()
      return res.json({
        message:'Order placed success fully',
        status:true
      })
    }
    res.json({
      message: 'failed to create order',
      status: false,
    })
  } catch (err) {
    console.log(err);
    res.json({
      message: err.message,
      status: false,
    });
  }
};

//|| GET METHODS
// user profile
module.exports.userProfile = async (req, res) => {
  try {
    const user = req.user;
    const { _id, email, phone, address, userName: name } = user && user;
    res.json({
      user: { _id, email, phone, address, name },
      status: true,
    });
  } catch (err) {
    res.json({
      message: err,
      status: false,
    });
  }
};
module.exports.getUnblockedProducts = async (req, res) => {
  try {
    const products = await productModel.find({ blockStatus: false });
    if (products) {
      return res.json({
        message: "success",
        status: true,
        products,
      });
    } else {
      res.json({
        message: "cannot get product details",
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      message: "internal server error",
      status: false,
    });
  }
};

//|| PRODUCT DETAILS
module.exports.productDetails = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log('id',id)
    const product = await productModel.findById(id);
    if (product) {
      if (product.blockStatus) {
        return res.json({
          message: "product blocked by admin",
          status: false,
        });
      }
      return res.json({
        message: "success",
        status: true,
        product,
      });
    }
    res.json({
      message: "cannot get data",
      status: false,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "internal server error",
      status: false,
    });
  }
};

//GET CART
module.exports.getCart = async (req, res) => {
  try {
    const user = await req.user.populate("cart.productId");
    const cart = user.cart;
    res.json({
      message: "success",
      status: true,
      cart,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: false,
      message: "Internal server error",
    });
  }
};

//GET ORDERS
module.exports.getUserOrders = async (req, res) => {
 try{
  const orders = await orderModel.find({userId: req.user._id}).populate('productId').populate('userId')
  if(orders){
    return res.json({
      orders,
      message:'success',
      status:true
    })
  }
  res.json({
    status:false,
    message:'error fetching data'
  })
 }catch (err) {
  console.log(err);
  res.json({
    status: false,
    message: "Internal server error",
  });
}
}
//GET ORDER DETAILS
module.exports.orderDetails = async (req, res) => {
  try{
    // console.log(req.params.orderId)
    const orderDetails = await orderModel.findOne({_id: req.params.orderId, userId: req.user._id}).populate('productId').populate('userId')
    if(orderDetails){
      return res.json({
        message:'success',
        status:true,
        orderDetails
      })
    }
    res.json({
      message:'error fetching data',
      status:false
    })
  }catch (err) {
    console.log(err);
    res.json({
      status: false,
      message: "Internal server error",
    });
  }
}

//|| PUT METHODS
//Edit profile
module.exports.editUserProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const { address } = req.body;
    console.log(address);
    const editedData = await userModel.findByIdAndUpdate(_id, { address });
    if (editedData) {
      res.json({
        message: "updated successfully",
        status: true,
      });
    } else {
      res.json({
        message: "update failed",
        status: false,
      });
    }
  } catch (err) {
    res.json({
      message: err,
      status: false,
    });
  }
};
//ADD TO CART
module.exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let itemIndex;
    //check product already exists in cart
    const existingProduct = req.user.cart.find((value, index) => {
      if (value.productId.toString() === productId) {
        itemIndex = index;
        return true;
      }
      return false;
    });
    //add quantity + 1 if exists
    if (existingProduct) {
      existingProduct.quantity += 1;
      req.user.cart.splice(itemIndex, 1, existingProduct);
      await req.user.save();
      return res.json({
        message: "Added to cart",
        status: true,
      });
    } else {
      req.user.cart.push({ productId });
      await req.user.save();
      return res.json({
        message: "Added to cart",
        status: true,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      message: "internal server error",
      status: false,
    });
  }
};

// EDIT CART QTY
module.exports.editCartQty = async (req, res) => {
  try {
    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity);
    let itemIndex;
    const existingProduct = req.user.cart.find((value, index) => {
      if (productId === value.productId.toString()) {
        itemIndex = index;
        return true;
      }
      return false;
    });
    existingProduct.quantity = quantity;
    req.user.cart.splice(itemIndex, 1, existingProduct);
    await req.user.save();
    return res.json({
      message: "Quantity updated",
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: "internal server error",
      status: false,
    });
  }
};

//REMOVE CART ITEM
module.exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const existingProductIndex = req.user.cart.findIndex((item) => {
      return item.productId.toString() === productId;
    });
    req.user.cart.splice(existingProductIndex, 1);
    await req.user.save();
    res.json({
      message: "Product removed from cart",
      status: true,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: err.message,
      status: false,
    });
  }
};

//CANCEL ORDER
module.exports.cancelOrder = async (req, res) => {
  try{
    const order = await orderModel.findOne({userId: req.user._id, _id: req.body.orderId})
    if(order){
      order.deliveryStatus = 'canceled'
      order.cancelDate = date
      //change product stock after order cancel
      const product = await productModel.findById(order.productId)
      product.stock += order.quantity
      await order.save()
      await product.save()
      return res.json({
        message:'order canceled',
        status:true
      })
    }
    res.json({
      message:'failed to cancel order',
      status:false
    })
  }catch(err){
    console.log(err)
    res.json({
      message:err.message,
      status:false
    })
  }
}
