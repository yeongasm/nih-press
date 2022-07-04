import joi from 'joi';

const newProject = joi.object({
  title: joi.string()
    .max(255)
    .required(),
  description: joi.string()
    .max(255)
    .required(),
  tag_id: joi.number()
    .required(),
  repo_url: joi.string(),
  repo_type: joi.string()
    .valid('none', 'github', 'gitlab', 'bitbucket')
});

const updateProject = joi.object({
  title: joi.string()
    .max(255),
  description: joi.string()
    .max(255),
  show: joi.boolean(),
  publish: joi.boolean(),
  hash: joi.number(),
  tag_ids: joi.array()
    .items(joi.number()),
  repo_url: joi.string(),
  repo_type: joi.string()
    .valid('none', 'github', 'gitlab', 'bitbucket')
});

export default {
  newProject,
  updateProject
};
