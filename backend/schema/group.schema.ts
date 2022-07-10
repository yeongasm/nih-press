import joi from 'joi';

const newGroup = joi.object({
  name: joi.string().required()
});

const editGroup = newGroup;

export default {
  newGroup,
  editGroup
};
