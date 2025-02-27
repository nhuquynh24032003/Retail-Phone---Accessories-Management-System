const bcrypt = require('bcrypt');
const userService = require('../services/UserService');
const accountService = require('../services/AccountService');
const userVerificationService = require('../services/UserVerificationService');
const User = require('../models/User');
const Account = require('../models/Account');

class UserAdminController {

    async registerNewUser(req, res, next) {
        const { username, useremail } = req.body;
        //check xem tai khoan da dang ky chua
        const AccountExist = await accountService.getAccountByEmail(useremail);
        const AccountValue = AccountExist.data;
        console.log(AccountValue);
        if(AccountValue){
            if(AccountValue.verified) {
                req.flash('type', 'danger');
                req.flash('message', 'Tài khoản đã tồn tại.');
                res.redirect('../listemployee');
            }
            //Tk đã đăng ký nhưng chưa verified => kiểm tra tồn tại UserVerified hay không
            else{
                const userVerification = await userVerificationService.getUserVerificationByUserId(AccountValue.userId)
                if(userVerification.data){
                    req.flash('type', 'danger');
                    req.flash('message', 'Tài khoản đã được đăng ký. Hãy kiểm tra tài khoản email');
                    res.redirect('../listemployee');
                }
                //Gửi lại email verification
                else{
                    const user = await userService.getUserById(AccountValue.userId)
                    const newUser = user.data
                    userVerificationService.sendVerificationEmail(newUser)
                        .then((result) => {
                            // Send mail thanh cong
                            if (result.status === true) {
                                req.flash('type', 'success');
                                req.flash('message', `Email xác thực đã được gửi đến ${newUser.userEmail}. Đường link sẽ hết hạn trong vòng 1 phút.`);
                            } else {
                                req.flash('type', 'danger');
                                req.flash('message', 'Lỗi khi gửi mail: ' + result.message);
                            }
                        })
                        .catch((err) => {
                            req.flash('type', 'danger');
                            req.flash('message', 'Lỗi khi gửi mail: ' + err.message);
                        })
                        .finally(() => {
                            res.redirect('../listemployee');
                        });
                }
              
            }
        }
        else{
            const newUser = new User({ userEmail: useremail, fullName: username });
            userService.createUser(newUser)
                .then(async (result) => {
                    if (result.status === true) {
                        const splitEmail = newUser.userEmail.split("@");
                        const hasedPassword = await bcrypt.hash(splitEmail[1], 10);
                        const newAccount = new Account({ userId:newUser._id, userEmail: newUser.userEmail, userName: splitEmail[0], password: hasedPassword, verified: false, enable: true })
                        accountService.createAccount(newAccount)
                            .then(async (result) => {
                                if (result.status === true) {
                                    // Send mail
                                    userVerificationService.sendVerificationEmail(newUser)
                                        .then((result) => {
                                            // Send mail thanh cong
                                            if (result.status === true) {
                                                req.flash('type', 'success');
                                                req.flash('message', `Email xác thực đã được gửi đến ${newUser.userEmail}. Đường link sẽ hết hạn trong vòng 1 phút.`);
                                            } else {
                                                req.flash('type', 'danger');
                                                req.flash('message', 'Lỗi khi gửi mail: ' + result.message);
                                            }
                                        })
                                        .catch((err) => {
                                            req.flash('type', 'danger');
                                            req.flash('message', 'Lỗi khi gửi mail: ' + err.message);
                                        })
                                        .finally(() => {
                                            res.redirect('../listemployee');
                                        });
                                }
                            })
                            .catch((err) => {
                                req.flash('type', 'danger');
                                req.flash('message', 'Lỗi khi tạo tài khoản: ' + err.message);
                                res.redirect('../listemployee');
                            })
    
                    } else {
                        req.flash('type', 'danger');
                        req.flash('message', 'Lỗi khi tạo người dùng: ' + result.message);
                        console.error();
                        res.redirect('../listemployee');
                    }
                })
                .catch((err) => {
                    req.flash('type', 'danger');
                    req.flash('message', 'Lỗi khi tạo người dùng: ' + err.message);
                    res.redirect('../listemployee');
                });
        }

       
    }

}

module.exports = new UserAdminController;
