const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildDetailsGrid = async function(detailsData){
  let detailsGrid
  if(detailsData.length > 0){
    detailsGrid = '<div class="details-display">'
    detailsData.forEach(vehicle => { 
      //Left
      detailsGrid += '<div id= "detailsLeft">'
        //Image
        detailsGrid += '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_image 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
      detailsGrid += '</div>'

      //Right
      detailsGrid += '<div id="detailsRight">'
        //Heading
        detailsGrid += '<h2>'
        detailsGrid += '<a href="../../invD/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</a>'
        detailsGrid += '</h2>'
        //List 
        detailsGrid += '<ul id="detailsList">'
        detailsGrid += '<li><span>Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span></li>'
        detailsGrid += '<li><span>Description: ' + vehicle.inv_description + '</span></li>'
        detailsGrid += '<li><span>color: ' + vehicle.inv_color + '</span></li>'
        detailsGrid += '<li><span>Miles: ' + vehicle.inv_miles + '</span></li>'
        detailsGrid += '</ul>'
      detailsGrid += '</div>'
    })
    detailsGrid += '</div>'
  } else { 
    detailsGrid += '<p class="notice">Sorry, this vehicles information could not be found.</p>'
  }
  return detailsGrid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util