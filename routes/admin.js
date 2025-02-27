const express = require("express");
const router = express.Router();
const userAdminController = require("../controllers/UserAdminController")
const adminController = require("../controllers/AdminController")

// ADMIN_HOME
router.get("/home", adminController.index);

// ADMIN_LIST_EMPLOYEE
router.get("/listemployee", adminController.listEmployees);

router.post("/Employees/AddnewEmployee", userAdminController.registerNewUser);
// ADMIN_ABOUT_EMPLOYEE

// ADMIN_LIST_CUSTOMER
router.get("/listcustomer", adminController.listCustomer);

// ADMIN_ABOUT_CUSTOMER
router.get("/aboutcustomer", adminController.aboutCustomer);

// ADMIN_PRODUCTS
router.get("/products", adminController.listProducts);

// ADMIN_ABOUT_PRODUCT
router.get("/aboutproduct", adminController.aboutProduct);


module.exports = router;
