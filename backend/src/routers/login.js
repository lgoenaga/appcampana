const Router = require("express");
const router = Router();
const { compareSync } = require("bcryptjs");
const { validationResult } = require("express-validator");
const { checkValidateLogin } = require("../helpers/validatelogin");
const { generateJWT } = require("../middlewares/generatetoken");
const Usuario = require("../models/usuarios");

router.post("/", checkValidateLogin(), async function (req, res) {
  console.clear();
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error("Informacion incorrecta \n", errors.array());
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const usuario = await Usuario.findOne({ user: req.body.user });

    if (!usuario) {
      console.warn("Información Incorrecta");
      return res.status(401).json({ mensaje: "Información Incorrecta" });
    }

    const pwd = compareSync(req.body.password, usuario.password);

    if (!pwd) {
      console.warn("Información Incorrecta");
      return res.status(402).json({ mensaje: "Información Incorrecta" });
    }

    const estado = usuario.estado;

    if (estado != "Activo") {
      console.warn("Información Incorrecta");
      return res.status(423).json({ mensaje: "Información Incorrecta" });
    }

    const token = generateJWT(usuario);

    console.clear();
    console.info("Usuario Autorizado");

    return res.status(200).json({
      _id: usuario._id,
      user: usuario.user,
      rol: usuario.rol,
      access_token: token,
    });
  } catch (error) {
    console.error("Oucrrio un error", error);
    res.status(500).json({ mensaje: "Error interno en el servidor" });
  }
});

module.exports = router;
