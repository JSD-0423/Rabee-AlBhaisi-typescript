import Joi from "joi";

const bookSchema = Joi.object({
  id: Joi.number().integer().min(0),
  name: Joi.string().min(4).max(100).required(),
  author: Joi.string().min(4).max(20).required(),
  isbn: Joi.string()
    .min(1)
    .max(15)
    .pattern(RegExp(/^[0-9]*$/))
    .required(),
});

export const idSchema = Joi.number();

export default bookSchema;
