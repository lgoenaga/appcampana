const { check } = require("express-validator");

const checkValidateLogin = () => {
  return [
    check("user").notEmpty().withMessage("El usuario no puede estar vacio"),
    check("password")
      .notEmpty()
      .withMessage("El password no puede estar vacio"),
  ];
};

module.exports = {
  checkValidateLogin,
};
