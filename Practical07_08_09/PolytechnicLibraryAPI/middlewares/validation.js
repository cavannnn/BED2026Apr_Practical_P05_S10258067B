const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(255).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username cannot be empty",
    "string.alphanum": "Username must only contain letters and numbers",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 255 characters",
    "any.required": "Username is required",
  }),
  password: Joi.string().min(8).max(72).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password cannot exceed 72 characters",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("member", "librarian").required().messages({
    "any.only": "Role must be either member or librarian",
    "any.required": "Role is required",
  }),
});

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username cannot be empty",
    "any.required": "Username is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
});

const availabilitySchema = Joi.object({
  availability: Joi.string().valid("Y", "N").required().messages({
    "any.only": "Availability must be either Y or N",
    "any.required": "Availability is required",
  }),
});

function validateBody(schema) {
  return function (req, res, next) {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({ message: errorMessage });
    }

    next();
  };
}

function validateBookId(req, res, next) {
  const bookId = parseInt(req.params.bookId);

  if (isNaN(bookId) || bookId <= 0) {
    return res
      .status(400)
      .json({ message: "Invalid book ID. ID must be a positive number" });
  }

  next();
}

module.exports = {
  validateRegistration: validateBody(registerSchema),
  validateLogin: validateBody(loginSchema),
  validateAvailability: validateBody(availabilitySchema),
  validateBookId,
};
