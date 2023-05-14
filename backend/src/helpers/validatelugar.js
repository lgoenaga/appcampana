const { check } = require("express-validator");

const checkValidateLugar = () => {
  return [
    check("pollingStation")
      .notEmpty()
      .withMessage("El lugar de votación no puede estar vacio")
      .trim(),
    check("address")
      .notEmpty()
      .withMessage("La direccion no puede estar vacio")
      .trim(),
    check("department")
      .notEmpty()
      .withMessage("El Departamento no puede estar vacio")
      .trim(),
      check("township")
      .notEmpty()
      .withMessage("El municipio no puede estar vacio")
      .trim(),
  ];
};

module.exports = {
  checkValidateLugar,
};
