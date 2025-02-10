const express = require('express');
const {
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} = require('./movieController');
const { validateMovie } = require('./movieMiddleware');

const router = express.Router();

router.get('/', getMovies);
router.post('/', validateMovie, addMovie);
router.put('/:id', validateMovie, updateMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
