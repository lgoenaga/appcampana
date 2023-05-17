const { Router } = require("express");
const asignacionContacto = require("../models/asignarcontacto");
const lugarElectoral = require ('../models/lugarvotacion');
const moment = require("moment");
/*const { checkValidateLugar } = require("../helpers/validatelugar");*/
const { validationResult } = require("express-validator");
const { validateJWT } = require("../middlewares/validatetoken");

const router = Router();

router.get("/", validateJWT, async function (req, res) {

  try{

  const voterAssignments = await asignacionContacto.find().populate([
		{
			path: "polling",
			select: "pollingStation address department township",
		},
		{
			path: "voter",
			select: "identification firstName firstSurname",
		},
	]);

res.status(200).send(voterAssignments);

   
  } catch (error) {
    console.log("Ocurrio un error en el registro", error);
    res.status(500).send("Ocurrio un error en el registro");
  }
});

router.get("/:documentoId", async function (req, res) {
  
  let witness = await asiganacionTestigo.findById(req.params.documentoId);
  
  try {
    
    if (!witness)
      return res.status(404).send("Información no encuentrada");

    return res.status(200).send(witness);
  } catch (error) {
 
    return res.status(501).send("Ocurrio un error al tratar de leer la información");
  }
});

router.post(
  "/crear",
  [validateJWT],
  async function (req, res) {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).json({ errors: errors.array() });
    }

    const existTestigo = await asiganacionTestigo.findOne({ witness: req.body.witness });
    if (existTestigo) {
      console.warn("Testigo ya ha sido asignado");
      return res.status(409).send("Testigo ya ha sido asignado");
    }else{
      const existPolling = await asiganacionTestigo.findOne({$and: [{ polling: req.body.polling}, {numberPolling: req.body.numberPolling}]} );
      if (existPolling) {
        console.warn("Mesa ya ha sido asignada");
        return res.status(409).send("Mesa ya ha sido asignada");
      }
    }


    const role = req.payload.rol;
    

    try {
      if (role === "Administrador" || role === "Operador") {
  
        let witnessAssignment = asiganacionTestigo();
    
        witnessAssignment.polling = req.body.polling;
        witnessAssignment.witness = req.body.witness;
        witnessAssignment.status = req.body.status;
        witnessAssignment.numberPolling= req.body.numberPolling;
        witnessAssignment.dateCreation = moment(new Date()).format(
          "YYYY-MM-DD h:mm:ss A"
        );
        witnessAssignment.dateUpdate = moment(new Date()).format(
          "YYYY-MM-DD h:mm:ss A"
        );
        let polling = await lugarElectoral.findById(req.body.polling);

        if((req.body.numberPolling<=0) || (req.body.numberPolling>polling.numberPollingStation))
          return res.status(401).json({ mesaje: "Mesa no disponible" });

        witnessAssignment = await witnessAssignment.save();       

        polling.availablePollingStation--;
        polling.unavailablePollingStation++;

        polling = await polling.save();
 

        res.status(200).send(witnessAssignment);
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
  "/:Id",
  [validateJWT],
  async function (req, res) {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).json({ errors: errors.array() });
    }

    const role = req.payload.rol;

    try {
      if (role === "Administrador" || role === "Operador") {
        let witnessAssignment = await WitnessAssignment.findOne({
          _id: req.params.Id,
        });

        if (!witnessAssignment)
          return res.status(404).send("pollingPlace no se encuentra");

        witnessAssignment.pollingPlace = req.body.pollingPlace;
        witnessAssignment.witness = req.body.witness;
        witnessAssignment.status = req.body.status;

        witnessAssignment.dateUpdate = new Date();

        witnessAssignment = await witnessAssignment.save();

        res.status(200).send(witnessAssignment);
      } else {
        console.warn("Usuario no Autorizado");
        return res.status(401).json({ mesaje: "Usuario no Autorizado" });
      }
    } catch (error) {
      res
        .status(500)
        .send("Ocurrio un error al tratar de actualizar el pollingPlace");
    }
  }
);

router.delete("/:Id", validateJWT, async function (req, res) {
  const role = req.payload.rol;
  try {
    if (role === "Administrador") {

      let witnessAssignment = await asiganacionTestigo.findOne({
        _id: req.params.Id,
      });

      let polling = await lugarElectoral.findById(witnessAssignment.polling);     
 
      if (!witnessAssignment) {
        return res.status(404).send("Lugar de votación no esta registrado");
      } else {
        
        witnessAssignment = witnessAssignment.delete();

        polling.availablePollingStation++;
        polling.unavailablePollingStation--;

        polling = await polling.save();
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
