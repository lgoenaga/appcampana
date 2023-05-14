const mongoose = require("mongoose");
const { Schema } = mongoose;

const Testigo = new Schema(
  {
    identification: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      required: false,
    },
    firstSurname: {
      type: String,
      required: true,
    },
    secondSurname: {
      type: String,
      required: false,
    },
    dateBirth: {
      type: String,
      required: false,
    },
    cellPhone: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: String,
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

module.exports = mongoose.model("testigo", Testigo);
