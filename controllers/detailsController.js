const invVehicle = require("../models/inventory-model") //?
const utilities = require("../utilities/")

const invDet = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invDetails.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByVehicleId(inv_id) //?
  const grid = await utilities.buildVehicleGrid(data) //?
  let nav = await utilities.getNav()
  const vehicleMake = data[0].inv_make
  const vehicleModel = data[0].inv_model

  res.render("./inventory/details", {
    title: vehicleMake + " " + vehicleModel,
    nav,
    grid,
  })
}

module.exports = invDetails