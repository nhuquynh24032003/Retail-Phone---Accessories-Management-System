const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({ 
    userId: String,
    userEmail: String,
    userName: String,
    password: String,
    verified: Boolean,
    enabled: Boolean
});

module.exports = mongoose.model('Account', Account);