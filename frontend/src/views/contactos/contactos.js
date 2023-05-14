import React from "react";
import { ListCiudadanos } from "../../services/contactos/contactoslistar";
import BarraNavegacion from "../../components/header";
import Footer from "../../components/footer";

const ViewContactos = () => {
  return (
    <>
      <BarraNavegacion />
      <ListCiudadanos />
      <Footer />
    </>
  );
};

export default ViewContactos;
