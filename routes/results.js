const express = require('express');
const router = express.Router();

/* GET results index page /results */
router.get('/', (req, res, next) => {
  res.send('/results');
});

/* GET show page for one result /results/:id */
router.get('/:id', (req, res, next) => {
    res.send('/results/:id');
  });

/* POST CREATE result /results/:id */
router.post('/', (req, res, next) => {
    res.send('/results');
  });

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