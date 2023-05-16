const { Router } = require("express");
const LugarElectoral = require("../models/lugarvotacion");
const moment = require("moment");
const { checkValidateLugar } = require("../helpers/validatelugar");
const { validationResult } = require("express-validator");
const { validateJWT } = require("../middlewares/validatetoken");

const router = Router();

router.get("/", validateJWT, async function (req, res) {
	try {
		const pollingplaces = await LugarElectoral.find();
		res.send(pollingplaces);
	} catch (error) {
		console.log("Ocurrio un error en el registro", error);
		res.status(500).send("Ocurrio un error en el registro");
	}
});

router.get("/:Id", async function (req, res) {
	try {
		const pollingPlace = await LugarElectoral.findById(req.params.Id);

		if (!pollingPlace)
			return res.status(404).send("Lugar de votación no se encuentra");

		res.status(200).send(pollingPlace);
	} catch (error) {
		res.status(500).send("Ocurrio un error al tratar de leer el polling Place");
	}
});

router.post(
	"/crear",
	[checkValidateLugar(), validateJWT],
	async function (req, res) {
		let errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(422).json({ errors: errors.array() });
		}

		const role = req.payload.rol;

		try {
			if (role === "Administrador" || role === "Operador") {
				let pollingPlace = LugarElectoral();

				pollingPlace.pollingStation = req.body.pollingStation;
				pollingPlace.address = req.body.address;
				pollingPlace.department = req.body.department;
				pollingPlace.township = req.body.township;
				pollingPlace.numberPollingStation = req.body.numberPollingStation;
				pollingPlace.availablePollingStation = req.body.numberPollingStation;
				pollingPlace.unavailablePollingStation = 0;

				pollingPlace.dateCreation = moment(new Date()).format(
					"YYYY-MM-DD h:mm:ss A"
				);
				pollingPlace.dateUpdate = moment(new Date()).format(
					"YYYY-MM-DD h:mm:ss A"
				);

				pollingPlace = await pollingPlace.save();

				res.status(200).send(pollingPlace);
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

router.put("/:Id", [validateJWT], async function (req, res) {
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).json({ errors: errors.array() });
	}

	const role = req.payload.rol;

	try {
		if (role === "Administrador" || role === "Operador") {
			let pollingPlace = await LugarElectoral.findById(req.params.Id);

			if (!pollingPlace)
				return res.status(404).send("Lugar de votacion no se encuentra");
      console.log(pollingPlace.unavailablePollingStation);
      console.log(req.body.numberPollingStation);

      if (pollingPlace.unavailablePollingStation > req.body.numberPollingStation)
       return res.status(409).send("Operacion no se puede realizar");

				pollingPlace.pollingStation = req.body.pollingStation;
			pollingPlace.address = req.body.address;
			pollingPlace.department = req.body.department;
			pollingPlace.township = req.body.township;
			pollingPlace.numberPollingStation = req.body.numberPollingStation;
			pollingPlace.availablePollingStation =
				pollingPlace.numberPollingStation -
				pollingPlace.unavailablePollingStation;
			pollingPlace.unavailablePollingStation =
				pollingPlace.numberPollingStation -
				pollingPlace.availablePollingStation;
			pollingPlace.dateUpdate = new Date();

			pollingPlace = await pollingPlace.save();

			res.status(200).send(pollingPlace);
		} else {
			console.warn("Usuario no Autorizado");
			return res.status(401).json({ mesaje: "Usuario no Autorizado" });
		}
	} catch (error) {
		res
			.status(500)
			.send("Ocurrio un error al tratar de actualizar el pollingPlace");
	}
});

router.delete("/:Id", validateJWT, async function (req, res) {
	const role = req.payload.rol;
	try {
		if (role === "Administrador") {
			let pollingPlace = await LugarElectoral.findOneAndDelete({
				_id: req.params.Id,
			});

			if (!pollingPlace) {
				return res.status(404).send("Lugar de votación no esta registrado");
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
