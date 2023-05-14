const { Router } = require("express");
const Testigo = require("../models/testigo");
const moment = require("moment");
const { checkValidateContacto } = require("../helpers/validatecontacto");
const { validationResult } = require("express-validator");
const { validateJWT } = require("../middlewares/validatetoken");

const router = Router();

router.get("/", validateJWT, async function (req, res) {

  try {
    const testigos = await Testigo.find();
    res.send(testigos);
  } catch (error) {
    console.log("Ocurrio un error en el registro", error);
    res.status(500).send("Ocurrio un error en el registro");
  }
});

router.get("/:documentoId", async function (req, res) {
  try {
    const testigo = await Testigo.findOne({
      identification: req.params.documentoId,
    });

    if (!testigo) return res.status(404).send("Testigo no se encuentra");

    res.status(200).send(testigo);
  } catch (error) {
    res.status(500).send("Ocurrio un error al tratar de leer el testigo");
  }
});

router.post(
  "/crear",
  [checkValidateContacto(), validateJWT],
  async function (req, res) {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).json({ errors: errors.array() });
    }

    const role = req.payload.rol;

    try {
      if (role === "Administrador" || role === "Operador") {
        const existTestigo = await Testigo.findOne({
          identification: req.body.identification,
        });

        if (existTestigo) {
          return res
            .status(400)
            .send("El testigo ya se encuentra registrado");
        }

        let testigo = Testigo();

        testigo.identification = req.body.identification;
        testigo.firstName = req.body.firstName;
        testigo.secondName = req.body.secondName;
        testigo.firstSurname = req.body.firstSurname;
        testigo.secondSurname = req.body.secondSurname;
        testigo.cellPhone = req.body.cellPhone;
        testigo.phone = req.body.phone;
        testigo.email = req.body.email;
        testigo.address = req.body.address;
        testigo.dateBirth = moment(req.body.dateBirth).format("YYYY-MM-DD");
        testigo.dateCreation = moment(new Date()).format(
          "YYYY-MM-DD h:mm:ss A"
        );
        testigo.dateUpdate = moment(new Date()).format(
          "YYYY-MM-DD h:mm:ss A"
        );

        testigo = await testigo.save();

        res.status(200).send(testigo);
      } else {
        console.warn("Usuario no Autorizado");
        return res.status(401).json({ mesaje: "Usuario no Autorizado" });
      }
    } catch (error) {
      console.log("El registro no se efectuo ", error);
      res.status(500).send("El registro no se efectuo ");
    }
  }
);

router.put(
  "/:documentoId",
  [checkValidateContacto(), validateJWT],
  async function (req, res) {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).json({ errors: errors.array() });
    }

    const role = req.payload.rol;

    try {
      if (role === "Administrador" || role === "Operador") {
        let testigo = await Testigo.findOne({
          identification: req.params.documentoId,
        });

        if (!testigo)
          return res.status(404).send("testigo no se encuentra");

        testigo.firstName = req.body.firstName;
        testigo.secondName = req.body.secondName;
        testigo.firstSurname = req.body.firstSurname;
        testigo.secondSurname = req.body.secondSurname;
        testigo.cellPhone = req.body.cellPhone;
        testigo.phone = req.body.phone;
        testigo.email = req.body.email;
        testigo.address = req.body.address;
        testigo.dateBirth = req.body.dateBirth;
        testigo.dateUpdate = new Date();

        testigo = await testigo.save();

        res.status(200).send(testigo);
      } else {
        console.warn("Usuario no Autorizado");
        return res.status(401).json({ mesaje: "Usuario no Autorizado" });
      }
    } catch (error) {
      res
        .status(500)
        .send("Ocurrio un error al tratar de actualizar el testigo");
    }
  }
);

router.delete("/:documentoId", validateJWT, async function (req, res) {
  const role = req.payload.rol;
  try {
    if (role === "Administrador") {
      let testigo = await Testigo.findOneAndDelete({
        identification: req.params.documentoId,
      });

      if (!testigo) {
        return res.status(404).send("testigo no esta registrado");
      } else {
        return res.status(200).send("Registro eliminado con exito");
      }
    } else {
      console.warn("Usuario no Autorizado");
      return res.status(401).json({ mesaje: "Usuario no Autorizado" });
    }
  } catch (error) {
    res.status(500).send("El registro no se pudo eliminar");
  }
});

module.exports = router;
