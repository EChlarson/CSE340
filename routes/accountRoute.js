// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

//Route to the View for the "My Account" page
router.get('/login', utilities.handleErrors(accountController.buildLogin));

//Route to the Registration view
router.get('/registration', utilities.handleErrors(accountController.buildRegistration));

//Route to post registration
router.post('/registration', utilities.handleErrors(accountController.registerAccount))

module.exports = router;