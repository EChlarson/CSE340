const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
  }
}

/* ***************************
 *  Get all inventory details
 * ************************** */
async function getInventoryByVehicleId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory WHERE inv_id = $1`, [inv_id]
    );
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByVehicleId error " + error)
    return null;
  }
}

/* ***************************
 *  Insert New Classification
 * ************************** */
async function insertClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get inventory details
 * ************************** */
async function getInventory() {
  return await pool.query("SELECT * FROM public.inventory")
}

/* ***************************
 *  Insert New Inventory
 * ************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
  return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
){
  
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function removeInventory(inv_id){
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

/* ***************************
 *  Additional Enhancement 
****************************/
/* ***************************
 *  Insert Favorites in Database
****************************/
async function addFavorite(account_id, inv_id) {
  try {
      const sql = `INSERT INTO favorites (account_id, inv_id)
                   VALUES ($1, $2) RETURNING *`;
      const data = await pool.query(sql, [account_id, inv_id]);
      return data.rows[0]; // return the newly created favorite
  } catch (error) {
      console.error("addFavorite error:", error);
      throw new Error("Could not add to favorites");
  }
}

/* ***************************
 *  Insert Review in Database
****************************/
async function addReview(inv_id, account_id, review_text, rating) {
  try {
    const sql = `INSERT INTO reviews (inv_id, account_id, review_text, rating)
                 VALUES ($1, $2, $3, $4) RETURNING *`;
    const data = await pool.query(sql, [inv_id, account_id, review_text, rating]);
    return data.rows[0]; // Return the newly added review
  } catch (error) {
    console.error("addReview error:", error);
    throw new Error("Could not add review");
  }
}

async function getReviewsByVehicleId(inv_id) {
  try {
    const sql = `
      SELECT r.review_text, r.rating, a.account_firstname
      FROM reviews r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1`;
    const data = await pool.query(sql, [inv_id]);
    
    console.log("Data returned from DB:", data.rows); // Log the result
    
    return data.rows; // This should return an array
  } catch (error) {
    console.error("getReviewsByVehicleId error:", error);
    throw new Error("Could not retrieve reviews");
  }
}

async function checkIfFavorite(inv_id, account_id) {
  try {
    const sql = `SELECT * FROM favorites WHERE inv_id = $1 AND account_id = $2`;
    const data = await pool.query(sql, [inv_id, account_id]);
    return data.rowCount > 0; // Returns true if it's a favorite
  } catch (error) {
    console.error('Error checking if favorite:', error);
    throw new Error('Could not check favorite status');
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByVehicleId, insertClassification, addInventory, getInventory, updateInventory, removeInventory, addFavorite, addReview, getReviewsByVehicleId, checkIfFavorite};