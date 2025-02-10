const express = require('express');
const { validateBook } = require('./bookMiddleware');

const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} = require('./bookController');

const router = express.Router();

router.get('/', getBooks);
router.post('/', addBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;
