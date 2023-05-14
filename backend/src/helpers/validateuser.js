const { check } = require("express-validator");

const checkValidateUser = () => {
  return [
    check("user")
      .notEmpty()
      .withMessage("El usuario no puede estar vacio")
      .trim(),
    check("password")
      .notEmpty()
      .withMessage("El password no puede estar vacio")
      .isLength({ min: 4 })
      .withMessage("El password es demasiado corto minimo 4"),
    check("rol").notEmpty().withMessage("El rol no puede estar vacio"),
    check("estado").notEmpty().withMessage("El estado no puede estar vacio"),
  ];
};

module.exports = {
  checkValidateUser,
};
