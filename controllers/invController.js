const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build details view
 * ************************** */
invCont.buildByInventoryId = async function(req, res, next) {
  const inv_id = req.params.invId
  const detailsData = await invModel.getInventoryByVehicleId(inv_id)
  const detailsGrid = await utilities.buildDetailsGrid(detailsData)
  let nav = await utilities.getNav()
  const vehicleYear = detailsData[0].inv_year
  const vehicleMake = detailsData[0].inv_make
  const vehicleModel = detailsData[0].inv_model

  res.render("./inventory/details", {
    title: vehicleYear + " " + vehicleMake + " " + vehicleModel,
    nav,
    detailsGrid,
    errors: null,
  })
}

/* ***************************
 *  Build Management view
 * ************************** */
invCont.viewInv = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classification = await invModel.getClassifications();
  res.render('./inventory/management', {
    title: 'Management',
    nav,
    flash: req.flash(),
    errors: null,
  });
}

/* ***************************
 *  Build Add Classification view
 * ************************** */
invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render('./inventory/add-classification', {
    title: 'Add Classification',
    nav,
    flash: req.flash(),
    errors: null,
  });
}

invCont.addClassification = async function (req, res, next) {
  const classificationName = req.body.classification_name
  let classification = await invModel.getClassifications();
  try {
    const data = await invModel.insertClassification(classificationName)
    if (data) {
      let nav = await utilities.getNav()
      req.flash(
        "notice",
        `Congratulations, you did it! Look in the Nav bar.`
      )
      res.status(201).render("inventory/management", {
        title: 'Management',
        nav,
        classification,
        flash: req.flash(),
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, you did not make a new classification.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        flash: req.flash(),
        errors: null,
      })
    }
  } catch (error) {
    console.error("addClassification error: ", error);
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification - Error",
      nav,
      flash: req.flash(),
      errors: null,
    });
  }
};

module.exports = invCont