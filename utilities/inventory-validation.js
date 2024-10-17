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

  /* ******************************
 * Add Inventory validation Rules
 * ***************************** */
  invValidate.rules = () => {
    return [
      body("inv_price")
        .trim()
        .isNumeric()
        .withMessage("Please provide a valid price."),
      body("inv_miles")
        .trim()
        .isNumeric()
        .withMessage("Please provide a valid number of miles."),
      body("classification_id")
        .trim()
        .isNumeric()
        .withMessage("Please provide a valid classification ID."),
      body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a description."),
      body("inv_image")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide an image path."),
      body("inv_thumbnail")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a thumbnail path."),
      body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a color."),
      body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a make."),
      body("inv_model")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a model."),
      body("inv_year")
        .trim()
        .isNumeric()
        .withMessage("Please provide a valid year."),
    ];
};

   /* ******************************
 * Check data and return errors or 
   continue to Add Inventory
 * ***************************** */
invValidate.checkData = async (req, res, next) => {
    const { inv_price, inv_miles, classification_id, inv_description, inv_image, inv_thumbnail, inv_color, inv_make, inv_model, inv_year } = req.body;
    let classification = await invModel.getClassifications();
    let inventoryList = await utilities.getInv();
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            classification,
            inventoryList,
            flash: req.flash(),
            inv_price,
            inv_miles,
            classification_id,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_color,
            inv_make,
            inv_model,
            inv_year,
        });
        return;
    }
    next();
};

   /* ******************************
 * Check data, errors will be directed 
   back to the edit view
 * ***************************** */
invValidate.checkUpdateData = async (req, res, next) => {
  const { inv_price, inv_miles, classification_id, inv_description, inv_image, inv_thumbnail, inv_color, inv_make, inv_model, inv_year, inv_id } = req.body;
  let classification = await invModel.getClassifications();
  let inventoryList = await utilities.getInv();
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("inventory/edit-inventory", {
          errors,
          title: "Edit Inventory",
          nav,
          classification,
          inventoryList,
          flash: req.flash(),
          inv_price,
          inv_miles,
          classification_id,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_color,
          inv_make,
          inv_model,
          inv_year,
          inv_id,
      });
      return;
  }
  next();
};

module.exports = {classValidate,invValidate};