// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//These lines fixed my code it now has a body*****//
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
//*********************************************** */

//Route to the View for the "My Account" page
router.get('/login', utilities.handleErrors(accountController.buildLogin));

//Route to the Registration view
router.get('/registration', utilities.handleErrors(accountController.buildRegistration));

//Route to post registration
router.post('/registration', 
   regValidate.validate.registrationRules(),
   regValidate.validate.checkRegData,
   utilities.handleErrors(accountController.registerAccount))

//Route to post login 
router.post("/login",
  regValidate.logValidate.loginRules(),
  regValidate.logValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

//Route to user page
router.get("/user", 
  utilities.checkLogin,
  utilities.checkClearance,
  utilities.handleErrors(accountController.buildUser)) 

//Route to accManagement
router.get("/accManagement",
  utilities.handleErrors(accountController.buildAccManagement))

//Route to Update Account Page
router.get("/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
);

router.post("/account-update",
  utilities.checkLogin,
  regValidate.validate.updateAccountRules(),
  regValidate.validate.checkUpdatedData,
  utilities.handleErrors(accountController.accountUpdate)
); 

module.exports = router;