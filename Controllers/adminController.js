const adminModel = require("../Models/adminModel").adminModel;
const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const productModel = require("../Models/productModel");
const orderModel = require("../Models/orderModel");
const d = new Date();
const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
const maxAge = 60 * 60 * 24 * 3;

const tokenCreator = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
  return token;
};

//||POST

//ADMIN LOGIN
module.exports.adminLogin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const existingAdmin = await adminModel.findOne({ userName });
    if (!existingAdmin) {
      return res.json({
        status: false,
        message: "admin does not exist",
      });
    }
    const passwordMatch = bcrypt.compare(password, existingAdmin.password);
    if (!passwordMatch) {
      return res.json({
        status: false,
        message: "wrong password",
      });
    }
    const token = tokenCreator(existingAdmin._id);
    res.json({
      status: true,
      message: "login success",
      token,
    });
  } catch (err) {
    console.log("admin login error", err);
    res.json({
      message: "login failed",
      status: false,
    });
  }

  // const {userName, password} = req.body
  // try{
  //     const newAdmin = new adminModel({
  //         userName,
  //         password
  //     })
  //     const admin = await newAdmin.save()
  //     return res.json({
  //         message:'login success',
  //         status: true
  //     })
  // }
  // catch(err){
  //     console.log('admin login error',err)
  //     res.json({
  //         message:'login failed',
  //         status:false
  //     })
  // }
};

//CREATE PRODUCT
module.exports.createProduct = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = `${req.body.category[0].toUpperCase()}${req.body.category
      .slice(1)
      .toLowerCase()}`;
    const price = Number(req.body.price);
    const stock = parseInt(req.body.stock);
    const picture = req.file.path;
    const newProduct = new productModel({
      name,
      description,
      category,
      price,
      stock,
      picture,
    });
    const createdProduct = await newProduct.save();
    if (createdProduct) {
      return res.json({
        message: "product successfully creaeted",
        status: true,
      });
    } else {
      return res.json({
        message: "error editing product",
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

//||GET

//USER LIST
module.exports.userList = async (req, res) => {
  try {
    const users = await userModel.find();
    if (!users) {
      return res.json({
        message: "No users",
        status: false,
      });
    }
    res.json({
      message: "success",
      status: true,
      users,
    });
  } catch (err) {
    res.json({
      message: err,
      status: false,
    });
  }
};

//PRODUCTS
module.exports.getProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    if (products) {
      return res.json({
        products,
        status: true,
        message: "success",
      });
    }
    res.json({
      message:'cannot get products',
      status:true
    })
  } catch (err) {
    console.log(err);
    res.json({
      message: "internal server error",
      status: false,
    });
  }
};
//GET ORDERS
module.exports.getOrders = async (req, res) => {
  try{
   const orders = await orderModel.find().populate('productId').populate('userId')
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
    const orderDetails = await orderModel.findById(req.params.orderId).populate('productId').populate('userId')
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

//||PUT
//BLOCK/UNBLOCK USER
module.exports.updateUserBlockStatus = async (req, res) => {
  try {
    const { userID, blockStatus } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(userID, {
      blockStatus: !blockStatus,
    });
    if (!updatedUser) {
      return res.json({
        message: `cannot ${blockStatus ? "unblock" : "block"} user`,
        status: false,
      });
    }
    res.json({
      message: `successfully ${blockStatus ? "unblocked" : "blocked"} user`,
      status: true,
    });
  } catch (err) {
    res.json({
      message: err,
      status: false,
    });
  }
};

//BLOCK/UNBLOCK PRODUCT
module.exports.updateProductBlockStatus = async (req, res) => {
  try {
    const { productID, blockStatus } = req.body;
    const updatedProduct = await productModel.findByIdAndUpdate(productID, {
      blockStatus: !blockStatus,
    });
    if (!updatedProduct) {
      return res.json({
        message: `cannot ${blockStatus ? "unblock" : "block"} Product`,
        status: false,
      });
    }
    res.json({
      message: `successfully ${blockStatus ? "unblocked" : "blocked"} Product`,
      status: true,
    });
  } catch (err) {
    res.json({
      message: err,
      status: false,
    });
  }
};

//Edit Product
module.exports.editProduct = async (req, res) => {
  try {
    const { name, description, id } = req.body;
    const category = `${req.body.category[0].toUpperCase()}${req.body.category
      .slice(1)
      .toLowerCase()}`;
    const price = Number(req.body.price);
    const stock = parseInt(req.body.stock);
    const editedProduct = await productModel.findByIdAndUpdate(id,{
      name,
      description,
      category,
      price,
      stock,
    })
    if (editedProduct) {
      return res.json({
        message: "product successfully edited",
        status: true,
      });
    } else {
      return res.json({
        message: "error editing product",
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

//CONFIRM DELIVERY
module.exports.confirmDelivery = async (req, res) => {
  try{
    const order = await orderModel.findById(req.body.orderId)
    if(order){
      order.deliveryStatus = 'success'
      order.deliveryDate = date
      order.invoice = req.invoice
      await order.save()
      return res.json({
        message:'delivery confirmed',
        status:true
      })
    }
    res.json({
      message:'failed to confirm delivery',
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
