const { celebrate, Joi, Segments } = require("celebrate");

const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
  }),
});

module.exports = {
  validateUpdateUser,
};
