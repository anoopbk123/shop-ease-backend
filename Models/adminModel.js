const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
    userName: {
        required: true, // Corrected from 'require' to 'required'
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String,
    }
})

adminSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt()
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

module.exports.adminModel = mongoose.model('admin', adminSchema);
