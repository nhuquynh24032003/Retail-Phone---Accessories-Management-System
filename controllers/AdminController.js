const userService = require('../services/UserService');
const accountService = require('../services/AccountService');
let isAdmin = true;
class AdminController {
    index(req, res, next) {
        res.render("pages/admin/home", { isAdmin });
    }

    async listEmployees(req, res, next) {
        const employeesList = await userService.getAllUsers();
        let employeesResults = [];
        for (const element of employeesList.data) {
            if (element.fullName !== "admin") {
              const account = await accountService.getAccountByEmail(element.userEmail);
              const newEmployeeData = {
                user: element,
                account: account.data
              };
              employeesResults.push(newEmployeeData);
            }
          }
        res.render("pages/admin/listemployee", { employees: employeesResults, isAdmin })
    }

    listCustomer(req, res, next) {
        res.render("pages/admin/listcustomer", {isAdmin})
    }

    aboutCustomer(req, res, next){
        res.render("pages/admin/aboutcustomer", {isAdmin });
    }

    listProducts(req, res, next) {
        res.render("pages/admin/products", {isAdmin });
    }

    aboutProduct(req, res, next){
        res.render("pages/admin/aboutproduct", {isAdmin });
    }
}

module.exports = new AdminController;