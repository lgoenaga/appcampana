const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const db_user = process.env.USER_DB;
const db_pwd = process.env.USER_PWD;
const db_name = process.env.DB_MONGODB;

const getConection = async () => {
  const uri = process.env.DB_URI;
  mongoose.set("strictQuery", false);
  await mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("conectado a mongodb"))
    .catch((e) => console.log("error de conexión", e));
};

module.exports = getConection;
