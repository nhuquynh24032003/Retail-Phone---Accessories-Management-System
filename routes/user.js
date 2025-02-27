const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController")

//verified user
router.get('/verify/:userID/:uniqueString', userController.verifyUser);

// USER_POS
router.get("/POS", (req, res) => {
  res.render("pages/user/POS");
});

// USER/LISTORDER
router.get("/listorders", (req, res) => {
  res.render("pages/user/listorder");
});

// USER/ORDERDETAIL

router.get("/orderdetail", (req, res) => {
  res.render("pages/user/orderdetail");
});

// USER/CUSTOMEREINFORMATION

router.get("/customer_information", (req, res) => {
  res.render("pages/user/customer_information");
});

// USER/LISTPRODUCTS
router.get("/listproducts", (req, res) => {
  res.render("pages/user/listproduct");
});


// USER/ABOUTCUSTOMER
router.get("/aboutcustomer", (req, res) => {
  res.render("pages/user/aboutcustomer", {
    layout : "main.hbs"
  });
});

router.get("/aboutproduct", (req, res) => {
  res.render("pages/admin/aboutproduct", 
  { layout: "main.hbs" });
});

router.get("/invoice", (req, res) => {
  res.render("pages/user/invoice", {
      layout: "main.hbs"
  });
});

router.get("/profile", (req, res) => {
  res.render("pages//info", {layout : "main.hbs"});
})
module.exports = router;
