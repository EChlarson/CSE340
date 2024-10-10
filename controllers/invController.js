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

module.exports = invCont