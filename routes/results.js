const express = require('express');
const router = express.Router({mergeParams: true});
const { asyncErrorHandler, isLoggedIn, isAuthor } = require('../middleware/index');
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
router.get('/', isLoggedIn, asyncErrorHandler(resultsIndex));

/* GET new result page /results/new */
router.get('/new', isLoggedIn, newResult);

/* POST CREATE result /results */
router.post('/', isLoggedIn, asyncErrorHandler(createResult));

/* GET show page for one result /results/:id */
router.get('/:id', isLoggedIn, isAuthor, asyncErrorHandler(showResult));

/* GET EDIT result /results/:id/edit */
router.get('/:id/edit', isLoggedIn, isAuthor, asyncErrorHandler(editResult));

/* PUT UPDATE result /results/:id */
router.put('/:id', isLoggedIn, isAuthor, asyncErrorHandler(updateResult));

/* DESTROY DELETE result /results/:id */
router.delete('/:id', isLoggedIn, isAuthor, asyncErrorHandler(destroyResult));  

module.exports = router;