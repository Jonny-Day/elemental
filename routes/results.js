const express = require('express');
const router = express.Router();
const { asyncErrorHandler } = require('../middleware/index');
const { 
  resultsIndex,
  newResult, 
  createResult, 
  showResult,
  editResult,
  updateResult,
  destroyResult
 } = require('../controllers/results');

/* GET results index page /results */
router.get('/', asyncErrorHandler(resultsIndex));

/* GET new result page /results/new */
router.get('/new', newResult);

/* POST CREATE result /results */
router.post('/', asyncErrorHandler(createResult));

/* GET show page for one result /results/:id */
router.get('/:id', asyncErrorHandler(showResult));

/* GET EDIT result /results/:id/edit */
router.get('/:id/edit', asyncErrorHandler(editResult));

/* PUT UPDATE result /results/:id */
router.put('/:id', asyncErrorHandler(updateResult));


/* DESTROY DELETE result /results/:id */
router.delete('/:id', asyncErrorHandler(destroyResult));  





module.exports = router;