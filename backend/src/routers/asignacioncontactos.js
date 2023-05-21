const { Router } = require("express");
const asignacionContacto = require("../models/asignarcontacto");
const lugarElectoral = require("../models/lugarvotacion");
const moment = require("moment");

const { validationResult } = require("express-validator");
const { validateJWT } = require("../middlewares/validatetoken");

const router = Router();

router.get("/", validateJWT, async function (req, res) {
	try {
		const voterAssignments = await asignacionContacto.find().populate([
			{
				path: "polling",
				select:
					"pollingStation numberPollingStation availablePollingStation unavailablePollingStation",
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
	let voterAssignment = await asignacionContacto.findById(
		req.params.documentoId
	);

	try {
		if (!voterAssignment)
			return res.status(404).send("Información no encuentrada");

		return res.status(200).send(voterAssignment);
	} catch (error) {
		return res
			.status(501)
			.send("Ocurrio un error al tratar de leer la información");
	}
});

router.post("/crear", [validateJWT], async function (req, res) {
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).json({ errors: errors.array() });
	}

	const existContacto = await asignacionContacto.findOne({
		voter: req.body.voter,
	});
	if (existContacto) {
		console.warn("Ciudadano ya ha sido asignado");
		return res.status(409).send("Ciudadano ya ha sido asignado");
	}

	const role = req.payload.rol;

	try {
		if (role === "Administrador" || role === "Operador") {
			let voterAssignments = asignacionContacto();

			voterAssignments.polling = req.body.polling;
			voterAssignments.voter = req.body.voter;
			voterAssignments.numberPolling = req.body.numberPolling;
			voterAssignments.dateCreation = moment(new Date()).format(
				"YYYY-MM-DD h:mm:ss A"
			);
			voterAssignments.dateUpdate = moment(new Date()).format(
				"YYYY-MM-DD h:mm:ss A"
			);

			let disponibleMesa = await lugarElectoral.findById(req.body.polling);

			if (disponibleMesa.availablePollingStation > 0) {
				voterAssignments = await voterAssignments.save();

				res.status(200).send(voterAssignments);
			} else {
				console.warn("No hay mesas disponibles");
				return res.status(409).send("No hay mesas disponibles");
			}
		} else {
			console.warn("Usuario no Autorizado");
			return res.status(401).json({ mesaje: "Usuario no Autorizado" });
		}
	} catch (error) {
		console.log("El registro no se efectuo ", error);
		res.status(500).send("El registro no se efectuo ");
	}
});

router.put("/:Id", [validateJWT], async function (req, res) {
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).json({ errors: errors.array() });
	}

	const role = req.payload.rol;

	try {
		if (role === "Administrador" || role === "Operador") {
			let voterAssignment = await asignacionContacto.findOne({
				_id: req.params.Id,
			});

			if (!voterAssignment)
				return res.status(404).send("pollingPlace no se encuentra");

			voterAssignment.pollingPlace = req.body.pollingPlace;
			voterAssignment.numberPolling = req.body.numberPolling;

			voterAssignment.dateUpdate = new Date();

			voterAssignment = await voterAssignment.save();

			res.status(200).send(voterAssignment);
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
			let voterAssignment = await asignacionContacto.findOne({
				_id: req.params.Id,
			});

			if (!voterAssignment) {
				return res.status(404).send("Lugar de votación no esta registrado");
			} else {
				voterAssignment = voterAssignment.delete();

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
