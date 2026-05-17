const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array();
    return res.status(400).json({
      message: extractedErrors[0].msg,
      errors: extractedErrors,
    });
  }
  next();
};

module.exports = validateRequest;
