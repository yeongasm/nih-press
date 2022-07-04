import joi from 'joi';

const compressImage = joi.object({
  width: joi.number()
    .default(0),
  height: joi.number()
    .default(0),
  quality: joi.number().required()
});

const uploadImage = joi.object({
  tag_id: joi.number()
    .required()
});

const updateTag = joi.object({
  tag_ids: joi.array()
    .items(joi.number())
    .required(),
});

export default {
  compressImage,
  uploadImage,
  updateTag
};
