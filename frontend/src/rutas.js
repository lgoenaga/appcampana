import React from "react";
import { Routes, Route } from "react-router-dom";

import ViewAdministracion from "./views/administacion";
import ViewLogin from "./views/login";

import ViewUsuarios from "./views/usuarios/usuarioslistar";
import ViewCrearUsuario from "./views/usuarios/usuariocrear";
import ViewUpdateUsuario from "./views/usuarios/usuarioupdate";

import ViewContactos from "./views/contactos/contactos";
import ViewRegistroCiudadano from "./views/contactos/contactocrear";
import ViewUpdateCiudadano from "./views/contactos/contactoupdate";

import ViewTestigoCrear from './views/testigos/testigocrear';
import ViewTestigos from "./views/testigos/testigolistar";
import ViewUpdateTestigo from "./views/testigos/testigoupdate";

import ViewLugares from "./views/lugarvotacion/lugarlistar";
import ViewUpdateLugar from "./views/lugarvotacion/lugarupdate";
import ViewCrearLugar from "./views/lugarvotacion/lugarcrear";


const Rutas = () => {
  return (
		<div className="container-app noMostrarRutas">
			<Routes>

				<Route path="*" element={<ViewLogin />} />
				<Route exact path="/" element={<ViewLogin />} />
				<Route exact path="/login" element={<ViewLogin />} />

				<Route exact path="/inicio" element={<ViewAdministracion />} />

				<Route exact path="/contactos" element={<ViewContactos />} />
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

				<Route exact path="/usuarios" element={<ViewUsuarios />} />
				<Route extact path="/usuarios/crear" element={<ViewCrearUsuario />} />
				<Route
					exact
					path="/usuarios/:userLogin"
					element={<ViewUpdateUsuario />}
				/>

				<Route extact path="/testigos" element={<ViewTestigos />} />
				<Route extact path="/testigos/crear" element={<ViewTestigoCrear />} />
				<Route
					exact
					path="/testigos/:documentoId"
					element={<ViewUpdateTestigo />}
				/>

				<Route exact path="/lugares" element={<ViewLugares />} />
				<Route exact path="/lugares/:id" element={<ViewUpdateLugar />} />
				<Route exact path="/lugares/crear" element={<ViewCrearLugar />} />

			</Routes>
		</div>
	);
};

export default Rutas;
