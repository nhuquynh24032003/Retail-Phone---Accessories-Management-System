const accountService = require('../services/AccountService');
const Account = require('../models/Account');
const User = require('../models/User');
const userService = require('../services/UserService');
const bcrypt = require('bcrypt');

class AccessController {

    index(req, res, next) {
        res.render("pages/login", { layout: null });
    }
    loginPage(req, res, next) {
        res.render("pages/login", { layout: null });
    }
    async login(req, res, next) {
        const { username, password } = req.body;
        const result = await accountService.getAccountByUsername(username);
         //tồn tại tài khoản
        if(result.status==true){
            const account = result.data;

            if (account) {
                const hasedPassword = await bcrypt.hash(password, 10);
                if (username == "admin") {
                    if(bcrypt.compare(account.password,hasedPassword)){
                        res.redirect("admin/home");
                    }
                    else{
                        console.log("WRONGGGG")
                        req.flash('type', 'danger');
                        req.flash('message', 'Tên đăng nhập hoặc mật khẩu không đúng');
                        res.redirect("/login",);
                    }
                    
                }
                else {
                    if (bcrypt.compare(account.password,hasedPassword)){
                        res.redirect("user/POS");
                    }
                    else {
                        req.flash('type', 'danger');
                        req.flash('message', 'Tên đăng nhập hoặc mật khẩu không đúng');
                        res.redirect("/login",);
                    }
                }
            }
        }
        //không tồn tại tài khoản
        else {
            if (username === "admin" && password === "admin") {
                try {
                    // Tạo tài khoản admin
                    const hasedPassword = await bcrypt.hash(password, 10);
                    const newAdmin = new User({ fullName: username });
                    const adminResult = await userService.createUser(newAdmin);

                    if (adminResult.status === true) {
                        const newAccount = new Account({
                            userId: adminResult.data._id,
                            userName: newAdmin.userName,
                            password: hasedPassword,
                            verified: true,
                            enable: true,
                        });

                        const accountResult = await accountService.createAccount(newAccount);

                        if (accountResult.status === true) {
                            console.log("Tài khoản admin đã được tạo thành công.");
                            res.redirect("admin/home");
                        } else {
                            console.error("Lỗi khi tạo tài khoản admin:", accountResult.message);
                        }
                    } else {
                        console.error("Lỗi khi tạo tài khoản người dùng:", adminResult.message);
                    }
                } catch (error) {
                    console.error("Lỗi chung:", error.message);
                }
            }
            else {
                req.flash('type', 'danger');
                req.flash('message', 'Tên đăng nhập hoặc mật khẩu không đúng');
                res.redirect("/login",);
            }
        }
    }
}

module.exports = new AccessController;