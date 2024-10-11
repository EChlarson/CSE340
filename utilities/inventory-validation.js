const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const classValidate = {}
const invValidate = {}

  /* ******************************
 * Add Classification validation Rules
 * ***************************** */
  classValidate.rules = () => {
   return [
     body("classification_name")
       .trim()
       .isLength({ min: 1 })
       .withMessage("Please provide a name."),
   ]
}

   /* ******************************
 * Check data and return errors or 
   continue to Add Classification
 * ***************************** */
   classValidate.checkData = async (req, res, next) => {
      const { classification_name } = req.body;
      let errors = []
      let classification = await invModel.getClassifications();
      let inventoryList = await utilities.getInv();
      errors = validationResult(req);
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
          errors,
          title: "Add Classification",
          nav,
          flash: req.flash(),
          classification_name,
          classification,
          inventoryList,
        });
        return;
      }
      next();
  };

module.exports = {classValidate,invValidate};