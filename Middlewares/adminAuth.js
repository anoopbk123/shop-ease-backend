const jwt = require('jsonwebtoken')
const adminModel = require('../Models/adminModel').adminModel
require('dotenv').config()

module.exports = async (req, res, next)=>{
  try{
    const authHeader = req.headers.authorization
    const authToken = authHeader && authHeader.split(' ')[1]
    if(!authToken){
        return res.json({
            message:'authentication failed no token',
            status:false
        })
    }
    const decoded = jwt.verify(authToken, process.env.JWT_KEY)
    const admin = await adminModel.findById(decoded.id)
    if(!admin){
        return res.json({
            message:'un authorized',
            status:false,
            loginFailed:true
        })
    }
    req.admin = admin
    next()

  }
  catch(err){
    res.json({
        message:err.message,
        status:false
    })
  }
}

