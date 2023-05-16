import React from "react";
import { CreateAsignarTestigo } from "../../services/asignaciontestigo/asignaciontestigocrear";
import BarraNavegacion from "../../components/header";
import Footer from "../../components/footer";
import "../../css/registrociudadano.css";

const ViewCrearAsignarTestigo = () => {
	return (
		<>
			<BarraNavegacion />
			<h1>CREAR ASIGNACIÓN DE TESTIGO</h1>
			<CreateAsignarTestigo />
			<Footer />
		</>
	);
};

export default ViewCrearAsignarTestigo;
