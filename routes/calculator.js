const express = require('express');
const router = express.Router();

/* GET calculator page /calculator */
router.get('/', (req, res, next) => {
  res.send('/calculator');
});

module.exports = router;