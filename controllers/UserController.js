const bcrypt = require('bcrypt');
const userVerification = require('../services/UserVerificationService');
const accountService = require('../services/AccountService');
const userService = require('../services/UserService');
const userVerificationService = require('../services/UserVerificationService');
const User = require('../models/User');

class UserController {

    async verifyUser(req, res, next) {
        try {
            const { userID, uniqueString } = req.params;
            const user = await userVerification.getUserVerificationByUserId(userID);
            const userVeri = user.data
            if (userVeri) {
                const { expiredAt, uniqueString: hashedUniqueString } = userVeri;
                // hết thời gian 1p
                if (expiredAt < Date.now()) {
                    userVerification.delUserVerification(userID)
                    // return;
                    .then((result)=> {
                        if(result.status==true){
                            req.flash('type', 'danger');
                            req.flash('message', "Xác thực thất bại. Hết thời gian xác thực. Hãy liên hệ với quản trị viên để cấp đường link mới");
                            res.redirect("/login");
                        }
                        else{
                            req.flash('type', 'danger');
                            req.flash('message', "Xác thực thất bại. Hết thời gian xác thực. Hãy liên hệ với quản trị viên để cấp đường link mới");
                            res.redirect("/login");
                        }
                    })
                    .catch((error)=>{
                        req.flash('type', 'danger');
                            req.flash('message', "Xác thực thất bại. " + error.message);
                            res.redirect("/login");
                    });
                    //trong thời gian 1p
                } else {
                    const result = await bcrypt.compare(uniqueString, hashedUniqueString);
                    if (result) {
                        const accountUpdated = await accountService.updateAccountStatus(userID);
                        if (accountUpdated) {
                            await userVerification.delUserVerification(userID)
                            .then((result)=>{
                                if(result.status === true){
                                    req.flash('type', 'success');
                                    req.flash('message', "Xác thực thành công. Hãy tiến hành đăng nhập");
                                    res.redirect("/login");
                                }
                            })
                            .catch((error) =>{
                                req.flash('type', 'danger');
                                req.flash('message', "Xác thực thất bại. " + error.message);
                                res.redirect("/login");
                            })    
                        }
                        else {
                            req.flash('type', 'danger');
                            req.flash('message', "Xác thực thất bại. Không thể cập nhật trạng thái tài khoản");
                            res.redirect("/login");
                        }
                    }
                    else {
                        req.flash('type', 'danger');
                        req.flash('message', "Xác thực thất bại. Đường link đã bị thay đổi");
                        res.redirect("/login");
                    }
                }
            }
            else {
                req.flash('type', 'danger');
                req.flash('message', "Xác thực thất bại. Không tìm thấy xác thực người dùng");
                res.redirect("/login");
            }
        } catch (error) {
            req.flash('type', 'danger');
            req.flash('message', "Xác thực thất bại. " + error.message);
            res.redirect("/login");
        }
    }
}

module.exports = new UserController;
