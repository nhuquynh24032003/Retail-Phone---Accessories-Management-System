const { mongooseToObject } = require('../utils/convertMongoose')
const Account = require('../models/Account');

class AccountService {

    async createAccount(newAccount) {
        try {
            const result = await newAccount.save();
            return { status: true, data: result };
        } catch (error) {
            return { status: false, message: error.message };
        }
    }
    async getAccountByEmail(email) {
        try {
            const account = await Account.findOne({ userEmail: email });
            if (account) {
                return { status: true, data: mongooseToObject(account) };
            } else {
                return { status: false, message: "Không tìm thấy tài khoản với email: " + email };
            }
        } catch (error) {
            return { status: false, message: error.message };
        }
    }
    async getAccountByUsername(username) {
        try {
            const account = await Account.findOne({ userName: username });
            if (account) {
                return { status: true, data: mongooseToObject(account) };
            } else {
                return { status: false, message: "Không tìm thấy tài khoản với email: " + email };
            }
        } catch (error) {
            return { status: false, message: error.message };
        }
    }

    async updateAccountStatus(userID) {
        return await Account.findOneAndUpdate({ userId: userID }, { verified: true })
            .then((account) => {
                return { status: true, data: mongooseToObject(account) };
            })
            .catch((error) => {
                return { status: false, message: error.message };
            })
    }
}

module.exports = new AccountService;