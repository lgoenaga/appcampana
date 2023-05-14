import { useState, useEffect } from "react";
import { listCiudadanos } from "../../routes/contactos";
import TableContactos from "./contactostable";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../css/registrociudadano.css";

import { AuthHeaders } from "../../components/authheader";

export const ListCiudadanos = () => {
  const [ciudadanos, setCiudadanos] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const authheader = AuthHeaders();
      const vacio = localStorage.getItem(
        "Authorization"
      );
      if (vacio!=null) {
        const mostrarCiudadanos = async () => {
          try {
            const { data } = await listCiudadanos(authheader);
            setCiudadanos(data);
          } catch (error) {
            const request = Object.values(error);
            const message = request[2];
            const respuesta = message.data.status.error.httpCode;
            const mensaje =  message.data.status.error.messages[0];
            const txt = respuesta + ", " + mensaje + ": " + message.data.status.error.code;
              Swal.fire({
              icon: "error",
              title: txt,
              showConfirmButton: false,
              timer: 2000,
              didOpen: () => {
                Swal.showLoading();
              },
            });
            setTimeout(() => {
              Swal.close();
              navigate("/");
            }, 1000);
          }
        };
        Swal.fire({
          icon: "info",
          title: "Listando contactos",
          showConfirmButton: false,
          timer: 1000,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        setTimeout(() => {
          Swal.close();
          mostrarCiudadanos();
        }, 1000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Usuario sin permisos",
          showConfirmButton: false,
          timer: 1000,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        setTimeout(() => {
          Swal.close();
          navigate("/");
        }, 1000);

      }
    } catch (error) {
      console.log(
        "Error desde el servidor verificar backend  listar usuarios",
        error
      );
    }
  }, [navigate]);

  const DataTable = () => {
    let noReg = 1;

    return ciudadanos.map((res, i) => {
      res.noReg = noReg++;
      return <TableContactos obj={res} key={i} />;
    });
  };

  return (
    <div>
      <table className="table border-primary table-hover table-contactos">
        <thead className="table-group-divider">
          <tr className="table-info">
            <th scope="col" className="col-contactos">
              #
            </th>
            <th scope="col" className="col-contactos">
              Identificacion
            </th>
            <th scope="col" className="col-contactos">
              Primer Nombre
            </th>
            <th scope="col" className="col-contactos">
              Primer Apellido
            </th>
            <th scope="col" className="col-contactos">
              Fecha Nacimiento
            </th>
            <th scope="col" className="col-contactos">
              Acción
            </th>
          </tr>
        </thead>
        <tbody className="table-group-divider">{DataTable()}</tbody>
      </table>
    </div>
  );
};
