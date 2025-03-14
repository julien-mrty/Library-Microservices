// bookRoutes.js
const express = require('express');
const { validateBook } = require('./bookMiddleware');
const {
  addBook,
  updateBook,
  deleteBook,
  getAllBooksPaginated,
} = require('./bookController');
const { createBookSchema } = require('./validationSchemas');
const { updateBookSchema } = require('./validationSchemas');
const { validate } = require('./validationMiddleware');

const router = express.Router();

router.get('/', getAllBooksPaginated);

router.post('/', validate(createBookSchema), addBook);

router.put('/:id', validate(updateBookSchema), updateBook);

router.delete('/:id', deleteBook);

module.exports = router;
