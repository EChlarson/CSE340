const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
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
      grid +=  '<a href="../../inv/details/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/details/' + vehicle.inv_id +'" title="View ' 
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
Util.buildDetailsGrid = async function(vehicle) {   
  let detailsGrid = ''; 
  
    detailsGrid = '<div class="details-display">';            
      detailsGrid += '<div class="detailsLeft">';       
      detailsGrid += '<a href="../../inv/details/' + vehicle.inv_id         
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model         
        + ' details"><img src="' + vehicle.inv_image         
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model         
        + ' on CSE Motors" /></a>';       
      detailsGrid += '</div>';       
      
      detailsGrid += '<div class="detailsRight">';       
      detailsGrid += '<h2>';       
      detailsGrid += '<a href="../../inv/details/' + vehicle.inv_id         
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'        
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</a>';       
      detailsGrid += '</h2>';       
      
      detailsGrid += '<ul class="detailsList">'; 
      detailsGrid += '<li><span>Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span></li>';       
      detailsGrid += '<li><span>Description: ' + vehicle.inv_description + '</span></li>'; 
      detailsGrid += '<li><span>Color: ' + vehicle.inv_color + '</span></li>'; 
      detailsGrid += '<li><span>Miles: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span></li>'; 
      detailsGrid += '</ul>'; 
      detailsGrid += '</div>'; 
  
    detailsGrid += '</div>';
  
  return detailsGrid; 
};

/* **************************************
* Build the Inventory view HTML
* ************************************ */
Util.getInv = async function (req, res, next) {
  let data = await invModel.getInventory();
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
* Build Favorites View
* ************************************ */
Util.buildFavoritesGrid = async function(favorites) {
  let grid = '';
  console.log(favorites);

  // Check if favorites is a valid array
  if (Array.isArray(favorites) && favorites.length > 0) {
    grid = '<ul id="inv-display">'; // Start of the grid

    favorites.forEach(vehicle => {
      grid += `
        <li>
          <div class="vehicle-container">
            <a href="/inv/details/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" /></a>
            
            <div class="namePrice">
            <hr />
            <h2>
            <a href="/inv/details/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a>
            </h2>
              
            <span class="price">$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
            </div>

            <form action="/account/favorites/${account_id}" method="post" class="remove-favorite-form">
              <button type="submit">Remove from Favorites</button>
            </form>
          </div>
        </li>
      `;
    });

    grid += '</ul>'; // Close the grid
  } else {
    // If no favorites found, show a message
    grid = '<p class="notice">You have no favorite vehicles at the moment.</p>';
  }

  return grid;
};

/* **************************************
* Build Reviews View
* ************************************ */
Util.buildReviewsGrid = async function(reviews) {
  let grid = '';

  if (Array.isArray(reviews) && reviews.length > 0) { // Ensure reviews is an array
    grid = '<ul id="inv-display">'; // Start of the reviews grid

    reviews.forEach(review => {
      grid += `
        <li>
          <div class="review-container">
            <h3>User: ${review.account_firstname || 'Anonymous'}</h3>
            <p>Rating: ${'★'.repeat(review.rating)} (${review.rating} / 5)</p>
            <p>Review: ${review.review_text}</p>
          </div>
        </li>
      `;
    });

    grid += '</ul>'; // Close the grid
  } else {
    grid = '<p>No reviews available.</p>'; // Fallback if no reviews are found
  }

  return grid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedIn = true
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 * Middleware to Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
 
Util.checkClearance = (req, res, next) => {
  const accountType = res.locals.accountData.account_type
  if(accountType !== "Admin" && accountType !== "Employee"){
    req.flash("You do not have permission to access this page.")
    return res.redirect("/account/login")
  } else {
    next()
  }
}

module.exports = Util