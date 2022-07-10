import joi from 'joi';

const createArticle = joi.object({
  title: joi.string()
    .required(),
  description: joi.string()
    .required(),
  tag_id: joi.number()
    .required()
});

const updateArticle = joi.object({
  title: joi.string(),
  description: joi.string(),
  show: joi.boolean(),
  publish: joi.boolean(),
  hash: joi.number(),
  tag_ids: joi.array()
    .items(joi.number())
});

export default {
  createArticle,
  updateArticle
};
