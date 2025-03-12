const Joi = require('joi');

const createBookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  year: Joi.number().integer().min(1000).max(2026).required(),
});

const updateBookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    year: Joi.number().integer().min(1000).max(2026).required(),
  });

module.exports = {
  createBookSchema,
  updateBookSchema
};
