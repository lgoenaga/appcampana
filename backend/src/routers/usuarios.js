const Router = require("express");
const Usuario = require("../models/usuarios");
const router = Router();
const moment = require("moment");
const encrypt = require("bcryptjs");
const { checkValidateUser } = require("../helpers/validateuser");
const { validationResult } = require("express-validator");
const { validateJWT } = require("../middlewares/validatetoken");
const usuarios = require("../models/usuarios");

router.post(
  "/crear",
  [checkValidateUser(), validateJWT],
  async function (req, res) {
    console.clear();
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.warn("Error en las validaciones \n", errors.array());
      return res.status(422).json({
        message: "Error en las validaciones",
        errors: errors.array(),
      });
    }

    const role = req.payload.rol;

    try {
      if (role === "Administrador") {
        const existUser = await Usuario.findOne({ user: req.body.user });
        if (existUser) {
          console.warn("El usuario ya existe");
          return res.status(409).send("El usuario ya existe");
        }

        let usuario = Usuario();

        const salt = encrypt.genSaltSync();

        const password = encrypt.hashSync(req.body.password, salt);
        usuario.password = password;

        usuario.user = req.body.user;
        usuario.rol = req.body.rol;
        usuario.estado = req.body.estado;
        usuario.dateCreation = moment(new Date()).format(
          "YYYY-MM-DD h:mm:ss A"
        );
        usuario.dateUpdate = moment(new Date()).format("YYYY-MM-DD h:mm:ss A");

        usuario = await usuario.save();

        console.info("Usuario creado correctamente");
        console.log(usuario);
        return res.status(200).json({
          message: "Usuario creado correctamente",
          data: usuario,
        });
      } else {
        console.warn("Usuario no Autorizado");
        return res.status(401).json({ mesaje: "Usuario no autorizado" });
      }
    } catch (error) {
      console.log("Usuario no se ha podido crear \n");
      console.error(error.name + ": " + error.message);
      return res.status(500).json({
        message: "Usuarios no se han podido crear",
        cause: error,
      });
    }
  }
);

router.get("/", validateJWT, async function (req, res) {
  console.clear();

  const role = req.payload.rol;
  const status = req.payload.rol;

  try {

    if (role==='Administrador'){
      console.info("Usuarios Listados");
      const usuarios = await Usuario.find();
      return res.status(200).send(usuarios);
      
    }else{

      console.info("Usuarios Listados");
      const usuarios = await Usuario.find({estado: 'Activo'});
      return res.status(200).send(usuarios);
    } 
    
  } catch (error) {
    console.error("Usuarios no se han podido listar \n", error);
    console.error(error.name + ": " + error.message);
    return res.status(500).json({
      message: "Usuarios no se han podido listar",
      cause: error,
    });
  }
});

router.get("/:userLogin", async function (req, res) {
  console.clear();

   try {
   
      const usuario = await Usuario.findOne({
        user: req.params.userLogin,
      });

      if (!usuario) {
        console.warn("usuario no se encuentra");
        return res.status(404).send("usuario no se encuentra");
      } else {
        console.info("Usuario encontrado");
        return res.status(200).send(usuario);
      }
    
  } catch (error) {
    console.error("Ocurrio un error al tratar de leer el usuario");
    console.error(error.name + ": " + error.message);
    return res.status(500).json({
      message: "Ocurrio un error al tratar de leer el usuario",
      cause: error,
    });
  }
});

router.put(
  "/:userLogin",
  [checkValidateUser(), validateJWT],
  async function (req, res) {
    console.clear();
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.warn("Error en las validaciones \n", errors.array());
      return res.status(422).json({
        message: "Error en las validaciones",
        errors: errors.array(),
      });
    }

    const role = req.payload.rol;

    try {
      if (role === "Administrador") {
        let usuario = await Usuario.findOne({
          user: req.params.userLogin,
        });

        if (!usuario) {
          console.warn("Usuario no se encuentra");
          return res.status(404).send("Usuario no se encuentra");
        }
        usuario.user = req.body.user;
        const salt = encrypt.genSaltSync();
        const password = encrypt.hashSync(req.body.password, salt);
        usuario.password = password;

        usuario.rol = req.body.rol;
        usuario.estado = req.body.estado;
        usuario.dateUpdate = moment(new Date()).format("YYYY-MM-DD h:mm:ss A");

        usuario = await usuario.save();
        console.info("Usuario Actualizado");
        console.log(usuario);
        return res.status(200).json({
          message: "Usuario actualizado correctamente",
          data: usuario,
        });
      } else {
        console.warn("Usuario no autorizado");
        return res.status(401).json({ mesaje: "Usuario no autorizado" });
      }
    } catch (error) {
      console.log("Usuario no se ha podido actualizar \n");
      console.error(error.name + ": " + error.message);
      return res.status(500).json({
        message: "Usuario no se ha podido actualizar",
        cause: error,
      });
    }
  }
);

router.delete("/:userLogin", validateJWT, async function (req, res) {
  console.clear();

  const role = req.payload.rol;

  try {
    if (role === "Administrador") {
      let usuario = await Usuario.findOneAndDelete({
        user: req.params.userLogin,
      });

      if (!usuario) {
        console.warn("Usuario no esta registrado");
        return res.status(404).send("Usuario no esta registrado");
      } else {
        console.info("Usuario eliminado con exito");
        return res.status(200).send("Usuario eliminado con exito");
      }
    } else {
      console.warn("Usuario no autorizado");
      return res.status(401).json({ mesaje: "Usuario no autorizado" });
    }
  } catch (error) {
    console.log("El Usuario no se pudo eliminar \n");

    console.error(error.name + ": " + error.message);
    return res.status(500).json({
      message: "El Usuario no se pudo eliminar",
      cause: error,
    });
  }
});

module.exports = router;
