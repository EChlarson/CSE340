const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
  throw new Error("this is bad")
});

module.exports = router;