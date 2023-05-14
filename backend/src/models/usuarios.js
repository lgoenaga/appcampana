const mongoose = require("mongoose");
const { Schema } = mongoose;

const Usuario = new Schema(
  {
    user: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
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
    rol:{
        type: String,
        required: true,
        enum:[
            'Administrador',
            'Consultor',
            'Operador'
        ]
    },
    estado:{
      type: String,
      required: true,
      enum:[
        'Activo',
        'Inactivo'
      ]
    }
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("usuario", Usuario);
