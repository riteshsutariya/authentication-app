const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'Username Already Taken']
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email Already Taken!!']
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    admin: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('users', userSchema);