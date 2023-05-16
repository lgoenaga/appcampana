const express = require("express");
const getConexion = require("./library/dbconection");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();

const port = process.env.NODE_PORT || 4005;
const host = process.env.NODE_HOST;

const path = require("path");

app.use(cors());
getConexion();

app.use(express.json());

app.use(express.static(path.resolve(__dirname)));

app.use("/contactos", require("./routers/contactos"));
app.use("/candidatos", require("./routers/candidatos"));
app.use("/testigos", require("./routers/testigos"));
app.use("/usuarios", require("./routers/usuarios"));
app.use("/login", require("./routers/login"));
app.use("/lugares", require("./routers/lugarvotacion"));
app.use("/asignartestigo", require("./routers/asisganaciontestigos"));




// Todas las peticiones GET que no hayamos manejado en las líneas anteriores retornaran nuestro app React
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname));
});

app.listen(port, () => {
  console.clear(); 
  console.log(`Server ${host} listening on port ${port}`);
});
