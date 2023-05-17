const mongoose = require("mongoose");
const { Schema } = mongoose;

const asignacionContacto = new Schema(
	{
		polling: {
			type: Schema.Types.ObjectId,
			ref: "lugarvotacion",
			required: true,
		},
		voter: {
			type: Schema.Types.ObjectId,
			ref: "contacto",
			unique: true,
			required: true,
		},
		numberPolling: {
			type: Number,
			required: true,
		},

		dateCreation: {
			type: String,
			required: false,
		},
		dateUpdate: {
			type: String,
			required: false,
		},
	},
	{
		versionKey: false,
	}
);

module.exports = mongoose.model("asignacioncontacto", asignacionContacto);