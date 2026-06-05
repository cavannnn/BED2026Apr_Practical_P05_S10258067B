const Joi = require("joi");

const studentSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  address: Joi.string().min(1).max(255).required(),
});

function validateStudent(req, res, next) {
  const { error } = studentSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details.map((d) => d.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
}

function validateStudentId(req, res, next) {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid student ID. ID must be a positive number",
    });
  }

  next();
}

module.exports = {
  validateStudent,
  validateStudentId,
};