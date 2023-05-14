const { Router } = require("express");
const Candidato = require("../models/candidato");
const moment = require("moment");
const { checkValidateContacto } = require("../helpers/validatecontacto");
const { validationResult } = require("express-validator");
const { validateJWT } = require("../middlewares/validatetoken");

const router = Router();

router.get("/", validateJWT, async function (req, res) {
  const role = req.payload.rol;
  console.log(role);

  try {
    const candidatos = await Candidato.find();
    res.send(candidatos);
  } catch (error) {
    console.log("Ocurrio un error en el registro", error);
    res.status(500).send("Ocurrio un error en el registro");
  }
});

router.get("/:documentoId", async function (req, res) {
  try {
    const candidato = await Candidato.findOne({
      identification: req.params.documentoId,
    });

    if (!candidato) return res.status(404).send("Candidato no se encuentra");

    res.status(200).send(candidato);
  } catch (error) {
    res.status(500).send("Ocurrio un error al tratar de leer el Candidato");
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
        const existCandidato = await Candidato.findOne({
          identification: req.body.identification,
        });

        if (existCandidato) {
          return res
            .status(400)
            .send("El Candidato ya se encuentra registrado");
        }

        let candidato = Candidato();

        candidato.identification = req.body.identification;
        candidato.firstName = req.body.firstName;
        candidato.secondName = req.body.secondName;
        candidato.firstSurname = req.body.firstSurname;
        candidato.secondSurname = req.body.secondSurname;
        candidato.cellPhone = req.body.cellPhone;
        candidato.phone = req.body.phone;
        candidato.email = req.body.email;
        candidato.address = req.body.address;
        candidato.dateBirth = moment(req.body.dateBirth).format("YYYY-MM-DD");
        candidato.dateCreation = moment(new Date()).format(
          "YYYY-MM-DD h:mm:ss A"
        );
        candidato.dateUpdate = moment(new Date()).format(
          "YYYY-MM-DD h:mm:ss A"
        );

        candidato = await candidato.save();

        res.status(200).send(candidato);
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
        let candidato = await Candidato.findOne({
          identification: req.params.documentoId,
        });

        if (!candidato)
          return res.status(404).send("Candidato no se encuentra");

        candidato.firstName = req.body.firstName;
        candidato.secondName = req.body.secondName;
        candidato.firstSurname = req.body.firstSurname;
        candidato.secondSurname = req.body.secondSurname;
        candidato.cellPhone = req.body.cellPhone;
        candidato.phone = req.body.phone;
        candidato.email = req.body.email;
        candidato.address = req.body.address;
        candidato.dateBirth = req.body.dateBirth;
        candidato.dateUpdate = new Date();

        candidato = await candidato.save();

        res.status(200).send(candidato);
      } else {
        console.warn("Usuario no Autorizado");
        return res.status(401).json({ mesaje: "Usuario no Autorizado" });
      }
    } catch (error) {
      res
        .status(500)
        .send("Ocurrio un error al tratar de actualizar el Candidato");
    }
  }
);

router.delete("/:documentoId", validateJWT, async function (req, res) {
  const role = req.payload.rol;
  try {
    if (role === "Administrador") {
      let candidato = await Candidato.findOneAndDelete({
        identification: req.params.documentoId,
      });

      if (!candidato) {
        return res.status(404).send("Candidato no esta registrado");
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
