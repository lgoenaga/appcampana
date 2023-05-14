import React from "react";
import { ListTestigos } from "../../services/testigos/testigoslistar";
import BarraNavegacion from "../../components/header";
import Footer from "../../components/footer";

const ViewTestigos = () => {
  return (
    <>
      <BarraNavegacion />
      <ListTestigos />
      <Footer />
    </>
  );
};

export default ViewTestigos;
