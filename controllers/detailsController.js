const invVehicle = require("../models/inventory-model")
const utilities = require("../utilities/")
const invDetails = {}

/* ***************************
 *  Build details view
 * ************************** */
invDetails.buildByInventoryId = async function(req, res, next) {
  const inv_id = req.params.invId
  const detailsData = await invVehicle.getInventoryByVehicleId(inv_id)
  const detailsGrid = await utilities.buildVehicleGrid(detailsData)
  let nav = await utilities.getNav()
  const vehicleMake = detailsData[0].inv_make
  const vehicleModel = detailsData[0].inv_model

  res.render("./inventory/details", {
    title: vehicleMake + " " + vehicleModel,
    nav,
    detailsGrid,
  })
}

module.exports = invDetails