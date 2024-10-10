// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//Route to the View for the "My Account" page
router.get('/login', utilities.handleErrors(accountController.buildLogin));

//Route to the Registration view
router.get('/registration', utilities.handleErrors(accountController.buildRegistration));

//Route to post registration
router.post('/registration', 
   regValidate.registationRules(),
   regValidate.checkRegData,
   utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
   "/login",
   (req, res) => {
     res.status(200).send('login process')
   }
 )

module.exports = router;