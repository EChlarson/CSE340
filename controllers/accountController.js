const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
   let nav = await utilities.getNav()
   res.render("account/login", {
     title: "Login",
     nav,
     errors: null,
   })
 }
 
 /* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
   let nav = await utilities.getNav()
   res.render("account/registration", {
     title: "Register",
     nav,
     errors: null,
   })
 }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
   let nav = await utilities.getNav()
   const { account_firstname, account_lastname, account_email, account_password } = req.body

   // Hash the password before storing
   let hashedPassword
   try {
     // regular password and cost (salt is generated automatically)
     hashedPassword = await bcrypt.hashSync(account_password, 10)
   } catch (error) {
     req.flash("notice", 'Sorry, there was an error processing the registration.')
     res.status(500).render("account/registration", {
       title: "Registration",
       nav,
       errors: null,
     })
   }
   
   const regResult = await accountModel.registerAccount(
     account_firstname,
     account_lastname,
     account_email,
     hashedPassword
   )
 
   if (regResult) {
     req.flash(
       "notice",
       `Congratulations, you\'re registered ${account_firstname}. Please log in.`
     )
     res.status(201).render("account/login", {
       title: "Login",
       nav,
       errors: null
     })
   } else {
     req.flash("notice", "Sorry, the registration failed.")
     res.status(501).render("account/register", {
       title: "Registration",
       nav,
     })
   }
 }

 /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/accManagement")
   }
  } catch (error) {
  req.flash("notice", "Login failed. Please try again.");
  return res.status(500).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
  });
}
 }

/* ****************************************
*  Build user view
* ************************************ */
async function buildUser(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/user", {
    title: "Logged In",
    nav,
    flash: req.flash(),
    errors: null,
  })
}

/* ****************************************
*  Build accManagement
* ************************************ */
async function buildAccManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/accManagement", {
    title: "LoggedIn",
    nav,
    flash: req.flash(),
    errors: null,
  })
}

/* ****************************************
 *  Build Account Update View
 * ************************************ */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id } = req.params;
  const data = await accountModel.getAccountById(account_id);
  res.render("account/update", {
    title: "Edit Account",
    nav,
    flash: req.flash(),
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
    account_id: data.account_id,
    errors: null,
  })
}

 async function accountUpdate (req, res, next) {
  const{account_firstname,
    account_lastname,
    account_email,
    account_id,} = req.body
  let nav = await utilities.getNav()
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  );
  
  if (updateResult){
    const updatedName = updateResult.account_firstname + " " + updateResult.account_lastname
    const accountData = await accountModel.getAccountById(account_id)
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    res.redirect("/account/accManagement")
    req.flash("notice",`${updatedName}'s account was successfully updated.`)
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update/", {
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      errors: null,
    });
  }
};

/* ****************************************
 *  Change Password
 * ************************************ */
async function changePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  }catch (error) {
    req.flash("notice", "Sorry, there was an error changing your password.");
    res.status(500).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
    });
  }

  const updateResult = await accountModel.changePassword(hashedPassword, account_id)
  if (updateResult){
    const updatedName = updateResult.account_firstname + " " + updateResult.account_lastname
    req.flash("notice",`${updatedName}'s password was successfully updated.`)
    res.redirect("/account/accManagement")

  } else {
    req.flash("notice", "Sorry, the password update failed.");
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,

      flash: req.flash(),

      errors: null,
      account_id,
    });
  }
}

/* ****************************************
 *  Process logout
 * ************************************ */
async function accountLogout(req, res) {
  let nav = await utilities.getNav()
   req.flash("notice", "You're logged out.")
   res.clearCookie("jwt");
   return res.redirect("/")
}

/* ***************************
 *  Additional Enhancement
/* ***************************
*  View user's favorite items
* ************************** */
async function showFavoritesView(req, res, next) {
  const account_id = req.params.account_id;
  
  try {
    const favorites = await accountModel.getFavoritesByUser(account_id);

    if (!favorites || favorites.length === 0) {
      req.flash("notice", "No favorite vehicles found.");
    }

    // Pass favorites data to the view and build the grid
    const favoritesGrid = await utilities.buildFavoritesGrid(favorites, account_id);
    let nav = await utilities.getNav();

    res.render("account/favorites", { 
      title: "My Favorites",
      nav, 
      favoritesGrid, 
      errors: null
    });

  } catch (error) {
    console.error("Error retrieving favorites:", error);
    res.status(500).send("Error retrieving favorites");
  }
};

async function removeFavorite(req, res, next) {
  const account_id = res.locals.accountData.account_id;
  const inv_id = req.body.invId;
  console.log(inv_id, account_id); 

  try {
    await accountModel.removeFavorite(account_id, inv_id);

    const favorites = await accountModel.getFavoritesByUser(account_id);
  
      if (!favorites || favorites.length === 0) {
        req.flash("notice", "No favorite vehicles found.");
      }

    const favoritesGrid = await utilities.buildFavoritesGrid(favorites, account_id);
    let nav = await utilities.getNav();

    req.flash("notice", "Vehicle removed from favorites list.")
      res.render("./account/favorites", {
        title: "My Favorites",
        nav, 
        favoritesGrid, 
        errors: null
      })
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).send("Server error.");
  }
};

 module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildUser, buildAccManagement, buildAccountUpdate, accountUpdate, changePassword, accountLogout, showFavoritesView, removeFavorite}