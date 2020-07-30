const express = require('express');
const router = express.Router({mergeParams: true});
const { asyncErrorHandler, isLoggedIn, isAuthor, searchFilter } = require('../middleware/index');
const { 
  resultsIndex,
  postResult,
  newResult, 
  createResult, 
  showResult,
  editResult,
  updateResult,
  destroyResult
 } = require('../controllers/results');

/* GET results index page /results */
router.get('/', isLoggedIn, searchFilter, asyncErrorHandler(resultsIndex));

router.post('/new', postResult, isLoggedIn, newResult);

/* GET new result page /results/new */
router.get('/new', isLoggedIn, newResult);

/* POST CREATE result /results */
router.post('/', isLoggedIn, asyncErrorHandler(createResult));

/* GET show page for one result /results/:id */
router.get('/:id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(showResult));

/* GET EDIT result /results/:id/edit */
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(editResult));

/* PUT UPDATE result /results/:id */
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(updateResult));

/* DESTROY DELETE result /results/:id */
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(destroyResult));  

module.exports = router;