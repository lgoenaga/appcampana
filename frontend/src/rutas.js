import React from "react";
import { Routes, Route } from "react-router-dom";

import ViewAdministracion from "./views/administacion";

import ViewUsuarios from "./views/usuarios/usuarioslistar";
import ViewCrearUsuario from "./views/usuarios/usuariocrear";
import ViewUpdateUsuario from "./views/usuarios/usuarioupdate";

import ViewContactos from "./views/contactos/contactos";
import ViewRegistroCiudadano from "./views/contactos/contactocrear";
import ViewUpdateCiudadano from "./views/contactos/contactoupdate";

import ViewLugarVotacion from "./views/lugarvotacion";
import ViewAsistencia from "./views/asistencia";
import ViewLogin from "./views/login";
import ViewContactar from "./views/contactar";

const Rutas = () => {
  return (
    <div className="container-app noMostrarRutas">
      <Routes>
        <Route exact path="/" element={<ViewLogin />} />
        <Route
          exact
          path="/contactos/crear"
          element={<ViewRegistroCiudadano />}
        />
        <Route
          exact
          path="/contactos/:documentoId"
          element={<ViewUpdateCiudadano />}
        />
        <Route exact path="/inicio" element={<ViewAdministracion />} />
        <Route exact path="/lugarvotacion" element={<ViewLugarVotacion />} />
        <Route exact path="/contactos" element={<ViewContactos />} />
        <Route exact path="/Contactos/contactar" element ={<ViewContactar/>}/>
        <Route exact path="/asistencia" element={<ViewAsistencia />} />
        <Route exact path="/login" element={<ViewLogin />} />
        <Route exact path="/usuarios" element={<ViewUsuarios />} />
        <Route extact path="usuarios/crear" element={<ViewCrearUsuario />} />
        <Route
          exact
          path="/usuarios/:userLogin"
          element={<ViewUpdateUsuario />}
        />
        <Route path="*" element={<ViewLogin />} />
      </Routes>
    </div>
  );
};

export default Rutas;
