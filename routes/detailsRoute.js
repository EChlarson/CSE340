// Needed Resources 
const express = require("express")
const router = new express.Router() 
const detailsController = require("../controllers/detailsController")

// Route to build inventory details
router.get("/type/:invId", detailsController.buildByInventoryId);

module.exports = router;