import joi from 'joi';

const createUser = joi.object({
  username: joi.string()
    .required(),
  email: joi.string()
    .email()
    .required(),
  password: joi.string()
    .required()
    .min(8)
    // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
});

const updateProfile = joi.object({
  display_name: joi.string(),
  location: joi.string(),
  profile_img_url: joi.string().uri(),
  profile_banner_url: joi.string().uri(),
  resume_url: joi.string().uri()
});

const uploadDocument = joi.object({
  bucket: joi.string().valid('profile', 'banner', 'resume')
});

export default {
  createUser,
  updateProfile,
  uploadDocument
};
