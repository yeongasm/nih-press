import joi from 'joi';

const newTag = joi.object({
  key: joi.string()
    .required(),
  value: joi.string()
    .required(),
  group_id: joi.number()
    .required(),
  hidden: joi.boolean().default(false),
  is_primary_tag: joi.boolean().default(false)
});

const editTag = joi.object({
  key: joi.string(),
  value: joi.string(),
  group_id: joi.number(),
  hidden: joi.boolean()
});

export default {
  newTag,
  editTag
};
