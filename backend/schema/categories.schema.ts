import joi from 'joi';

const newCategory = joi.object({
  key: joi.string()
    .required(),
  value: joi.string()
    .required(),
  type: joi.string()
    .valid('bool', 'int', 'float', 'string')
    .required(),
  group: joi.string()
});

const editCategory = joi.object({
  key: joi.string(),
  value: joi.string(),
  type: joi.string()
    .valid('bool', 'int', 'float', 'string')
    .required(),
  group: joi.string()
});

export default {
  newCategory,
  editCategory
};
