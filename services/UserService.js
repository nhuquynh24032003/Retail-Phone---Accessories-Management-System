const {mongooseToObject} = require('../utils/convertMongoose')
const {multipleMongooseToObject} = require('../utils/convertMongoose')
const User = require('../models/User');
// const userVerificationService = require('./UserVerificationService');
class UserService{
    getAllUsers(){
        return User.find({})
            .then((users) => {
                return { status: true, data: multipleMongooseToObject(users)};
            })
            .catch((error) => {
                throw error;
            });
    }
    // getUserByEmail(email){
    //     return User.findOne({email})
    //       .then((user) => {
    //             return mongooseToObject(user);
    //         })
    //       .catch((error) => {
    //             throw error;
    //         });
    // }
    async getUserById(id){
        return User.findById(id)
           .then((user) => {
            return { status: true, data: mongooseToObject(user)};
            })
           .catch((error) => {
                throw error;
            });
    }
    async createUser(newUser) {
        try {
          const result = await newUser.save();
          return { status: true, data: mongooseToObject(result) };
        } catch (err) {
          return { status: false, message: err.message };
        }
    }

    // async createUserGG(newUser){
    //     const newUser1 = new User(newUser);
    //     return newUser1.save()
    //      .then((result) => {
    //         return mongooseToObject(result);
    //       })
    //      .catch((err) => {
    //         console.error('Lỗi khi lưu người dùng:', err);
    //         throw err;
    //       });
    // }
    async updateUserStatus(userID){
        return await User.findByIdAndUpdate(userID, { verified: true }, { new: true })
        .then((user)=>{
            return mongooseToObject(user);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    async updateUserPassword(userID, password){
        return await User.findByIdAndUpdate(userID, { password }, { new: true })
        .then((user)=>{
            return mongooseToObject(user);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
      
}

module.exports = new UserService;