const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserVerification = new Schema({ 
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expiredAt: Date
});

module.exports = mongoose.model('UserVerification', UserVerification);