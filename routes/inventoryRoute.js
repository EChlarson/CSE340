// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities');
const validate = require('../utilities/inventory-validation');


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory details
router.get("/details/:invId", utilities.handleErrors(invController.buildByInventoryId));

//Route to Management View
router.get("/management/", utilities.handleErrors(invController.viewInv));

//Route to Add Classification View
router.get("/add-classification", utilities.handleErrors(invController.buildClassification));

router.post("/add-classification",
    validate.classValidate.rules(),
    utilities.handleErrors(invController.addClassification));

//Route to Add Inventory View
router.get("/add-inventory",
    utilities.handleErrors(invController.buildInventory));

router.post("/add-inventory",
    validate.invValidate.rules(),
    utilities.handleErrors(invController.addInventory));

//works with the URL in the JavaScript file inventory.js    
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Edit Inventory View (Modify from management page)
router.get("/edit-inventory/:inv_id",
    utilities.handleErrors(invController.editInventory))

router.post("/edit-inventory/",
    validate.invValidate.rules(),
    utilities.handleErrors(invController.updateInventory))

//Delete Inventory View (Delete from management page)
router.get("/delete-confirm/:inv_id",
    utilities.handleErrors(invController.deleteInventory))
    
router.post("/delete-confirm/",
    utilities.handleErrors(invController.removeInventory))

/* ***************************
 *  Additional Enhancement 
****************************/

//Favorites Route
router.post("/favorites",
    utilities.handleErrors(invController.addFavorite))
    
//Review Route
router.post("/review", 
    utilities.handleErrors(invController.addReview));

router.post('/reviews/:invId', 
    utilities.handleErrors(invController.reviewView));

module.exports = router;