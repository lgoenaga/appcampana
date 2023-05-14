const mongoose = require("mongoose");
const { Schema } = mongoose;

const asiganacionTestigo = new Schema(
  {
    polling: {
        type: Schema.Types.ObjectId,
        ref: "lugarvotacion",
        required: true,
      },
      witness: {
        type: Schema.Types.ObjectId,
        ref: "testigo",
        unique: true,
        required: true,
      },
      numberPolling:{
        type: Number,
        required: true,
      },
  
      status:{
        type: String,
        required: true,
        enum:[
            'Asignada',
            'Disponible',
            'No disponible'
        ]
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

module.exports = mongoose.model("asiganaciontestigo", asiganacionTestigo );