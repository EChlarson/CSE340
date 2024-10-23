const pool = require("../database/");
const bcrypt = require('bcryptjs');

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
   try {
     const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
     return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
   } catch (error) {
     return error.message
   }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

async function checkExistingEmailUpdate(account_email, account_id){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1 AND account_id != $2"
    const email = await pool.query(sql, [account_email, account_id])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return User data for Log in
* *************************** */
async function accountLogin(account_email, account_password) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(account_password, user.account_password);
      if (passwordMatch) {
        return user;
      }
    }
    return null;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
* Return User data for Update
* *************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching id found")
  }
}

//Top Form
async function updateAccount(account_firstname, account_lastname, account_email, account_id){
  try {
    const sql =
    'UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *'
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("Unable to process account updates.")
  }
}

//Bottom Form
async function changePassword(account_password, account_id){
  try {
    const sql =
    'UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *'
    const data = await pool.query(sql, [
      account_password,
      account_id,
    ])

    return data.rows[0]
  } catch (error) {
    console.error("Unable to change account password.")
  }
}

/* ***************************
 *  Additional Enhancement
/* ***************************
*  Get user's favorite items
* ************************** */
async function getFavoritesByUser(account_id) {
  console.log(account_id);

  try {
      const sql =`SELECT i.* 
                  FROM inventory i
                  JOIN favorites f 
                  ON i.inv_id = f.inv_id
                  WHERE f.account_id = $1`;

      const data = await pool.query(sql, [account_id]);
      return data.rows;
  } catch (error) {
      console.error("getFavoritesByUser error:", error);
      throw new Error("Could not retrieve favorites");
  }
}

module.exports = {registerAccount, checkExistingEmail, checkExistingEmailUpdate, getAccountByEmail, accountLogin, updateAccount, getAccountById, changePassword, getFavoritesByUser}
