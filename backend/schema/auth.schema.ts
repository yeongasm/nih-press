import joi from 'joi';

const login = joi.object({
  email: joi.string()
    .email()
    .required(),
  password: joi.string()
    .required()
});

export default {
  login
};
