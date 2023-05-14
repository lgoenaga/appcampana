const mongoose = require("mongoose");
const { Schema } = mongoose;

const lugarElectoral = new Schema(
  {
    pollingStation: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    township: {
      type: String,
      required: true,
    },
    numberPollingStation: {
      type: Number,
      required: false,
    },
    availablePollingStation: {
      type: Number,
      required: false,
    },
    unavailablePollingStation: {
      type: Number,
      required: false,
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

module.exports = mongoose.model("lugarvotacion", lugarElectoral);
