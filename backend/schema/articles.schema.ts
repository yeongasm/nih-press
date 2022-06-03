import joi from 'joi';

const createArticle = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  category_id: joi.number()
});

const updateArticle = joi.object({
  title: joi.string(),
  description: joi.string(),
  category_id: joi.number()
});

export default {
  createArticle,
  updateArticle
};
