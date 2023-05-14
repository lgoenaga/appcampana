const jwt = require("jsonwebtoken");

const validateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];


  const api_key = process.env.API_KEY;

  if (!token) {
    return res.status(403).json({ mensaje: "No esta autorizado" });
  }

  try {
    const payload = jwt.verify(token, `${api_key}`);
    req.payload = payload;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(402)
      .json({ mensaje: "Error en el acceso realice el Login nuevamente" });
  }
};

module.exports = {
  validateJWT,
};
