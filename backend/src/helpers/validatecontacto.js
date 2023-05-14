const { check } = require("express-validator");

const checkValidateContacto = () => {
  return [
    check("identification")
      .notEmpty()
      .withMessage("La identificacion no puede estar vacio")
      .trim(),
    check("firstName")
      .notEmpty()
      .withMessage("El primer nombre no puede estar vacio")
      .trim(),
    check("firstSurname")
      .notEmpty()
      .withMessage("El primer apellido no puede estar vacio")
      .trim(),
    check("cellPhone")
      .notEmpty()
      .withMessage("El celular no puede estar vacio")
      .isNumeric()
      .withMessage("El celular debe tener solo numeros")
      .isLength(10)
      .withMessage("El celular debe tener 10 Digitos")
      .trim(),
    check("email")
      .notEmpty()
      .withMessage("El  email no puede estar vacio")
      .isEmail()
      .withMessage("Debe ser un email valido")
      .trim(),
  ];
};

module.exports = {
  checkValidateContacto,
};
