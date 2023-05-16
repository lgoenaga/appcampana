import React from "react";
import { ListLugares } from "../../services/lugarvotacion/lugarlistar";
import BarraNavegacion from "../../components/header";
import Footer from "../../components/footer";

const ViewLugares = () => {
  return (
		<>
			<BarraNavegacion />
			<ListLugares />
			<Footer />
		</>
	);
};

export default ViewLugares;
