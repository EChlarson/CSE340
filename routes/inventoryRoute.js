// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities');
const validate = require('../utilities/inventory-validation');


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory details
router.get("/detail/:invId", invController.buildByInventoryId);

//Route to Management View
router.get("/management/", utilities.handleErrors(invController.viewInv));

//Route to Add Classification View
router.get("/add-classification", utilities.handleErrors(invController.buildClassification));

router.post("/add-classification",
    validate.classValidate.rules(),
    utilities.handleErrors(invController.addClassification)
);

module.exports = router;