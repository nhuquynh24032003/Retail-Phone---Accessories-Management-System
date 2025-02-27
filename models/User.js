const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({ 
    userEmail: String,
    fullName: String,
    phoneNumber: String,
    address: String,
    Dob: Date
});

module.exports = mongoose.model('User', User);