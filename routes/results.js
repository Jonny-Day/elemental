const express = require('express');
const router = express.Router();
const { asyncErrorHandler } = require('../middleware/index');
const { getResults, newResult, createResult, showResult } = require('../controllers/results');

/* GET results index page /results */
router.get('/', asyncErrorHandler(getResults));

/* GET new result page /results/new */
router.get('/new', newResult);

/* POST CREATE result /results */
router.post('/', asyncErrorHandler(createResult));

/* GET show page for one result /results/:id */
router.get('/:id', asyncErrorHandler(showResult));

/* GET EDIT result /results/:id/edit */
router.get('/:id/edit', (req, res, next) => {
    res.send('/results/:id/edit');
  });

/* PUT UPDATE result /results/:id */
router.put('/:id', (req, res, next) => {
    res.send('/results/:id');
  });


/* DESTROY DELETE result /results/:id */
router.delete('/:id', (req, res, next) => {
    res.send('/results/:id');
  });  





module.exports = router;