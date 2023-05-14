import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";

import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";

import { updateUsuario, getUsuario } from "../../routes/usuarios";
import { AuthHeaders } from "../../components/authheader";
import { MostrarRol } from "../../components/decodec";

export const UpdateRegistroUsuario = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const { userLogin } = useParams();

  const [valoresForm, setValoresForm] = useState({});

  const [usuario, setUsuario] = useState({});

  const { user = "", password = "", rol = "", estado = "" } = valoresForm;

  let userToken = MostrarRol();

  let userRol = userToken.rol;
  let userUser = userToken.user;

  const findFormErrors = () => {
    const { user, password, rol, estado } = valoresForm;
    const newErrors = {};

    if (!user || user === "") newErrors.name = "cannot be blank!";

    if (!rol || rol === "") newErrors.rol = "select a rol!";

    if (!password || password === "") {
      newErrors.password = "cannot be blank!";
    } else {
      if (password.length <= 4)
        newErrors.password = "Password too short! Minimum 4 characters";
    }

    if (!estado || estado === "") newErrors.estado = "select a state!";

    return newErrors;
  };

  useEffect(() => {
    if (userRol === "Administrador") {
      const mostrarusuario = async () => {
        try {
          const { data } = await getUsuario(userLogin);
          setUsuario(data);
        } catch (error) {
          Swal.fire({
            icon: "warning",
            title: "Usuario no existe",
            showConfirmButton: false,
            timer:2000,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          setTimeout(() => {
            Swal.close();
             navigate("/usuarios");
          }, 1000);
        }
      };

      Swal.fire({
        icon: "info",
        title: "Actualizar Usuario",
        showConfirmButton: false,
        timer: 1000,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      setTimeout(() => {
        Swal.close();
        mostrarusuario();
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
        navigate("/usuarios");
      }, 1000);
    }
  }, [navigate, userLogin, userRol]);

  useEffect(() => {
    setValoresForm({
      user: usuario.user,
      password: "",
      rol: usuario.rol,
      estado: usuario.estado,
    });
  }, [usuario]);

  const handleOnChange = ({ target }) => {
    const { name, value } = target;
    setValoresForm({ ...valoresForm, [name]: value });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    const usuario = {
      user,
      password,
      rol,
      estado,
    };
    if (user !== "administrador" || userUser==='administrador' )
      {Swal.fire({
        title: "Desea Actualizar el usuario? ",
        html: "Updating will be canceled in 10 <strong></strong> seconds.",
        timer: 10000,
        timerProgressBar: true,
        showDenyButton: true,
        showConfirmButton: true,
        confirmButtonText: "Update",
        denyButtonText: "Not update",
      }).then(async (result) => {
        let data = "";
        try {
          if (result.isConfirmed) {
            const authheader = AuthHeaders();
            data = await updateUsuario(userLogin, usuario, authheader);
            Swal.fire({
              icon: "success",
              title: "Usuario Actualizado",
              showConfirmButton: false,
              timer: 2000,
              didOpen: () => {
                Swal.showLoading();
              },
            });
            setTimeout(() => {
              Swal.close();
              
            }, 2000);
          } else {
            if (result.isDenied) {
              Swal.fire({
                icon: "info",
                title: "Usuario no ha sido actualizado",
                showConfirmButton: false,
                timer: 2000,
                didOpen: () => {
                  Swal.showLoading();
                  navigate("/usuarios");
                },
              });
              setTimeout(() => {
                Swal.close();
                navigate("/usuarios");
              }, 2000);
            }
          }
          if (result.dismiss === Swal.DismissReason.timer) {
            Swal.fire({
              icon: "error",
              title: "Se ha superado el tiempo sin una respuesta",
              showConfirmButton: false,
              timer: 2000,
              didOpen: () => {
                Swal.showLoading();               
              },
            });
            setTimeout(() => {
              Swal.close();
              navigate("/usuarios");
            }, 2000);
          }
        } catch (error) {
          let mensaje;
          const newErrors = findFormErrors();

          if (Object.keys(newErrors).length > 0) {
            mensaje = "Error en las validaciones";
          } else {
            mensaje = error.response.data;
          }
          Swal.fire({
            icon: "error",
            title: mensaje,
            showConfirmButton: false,
            timer: 2000,
          });
          Swal.showLoading();
        } finally {
          if (data) {
            setTimeout(() => {
              Swal.close();
            }, 2000);
          }
        }
      });}else{
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
          navigate("/usuarios");
        }, 1000);
      }
  };

  return (
    <>
      <Container className="contenedor-usuarios container-fluid">
        <Form
          noValidate
          validated={validated}
          onSubmit={(e) => handleOnSubmit(e)}
        >
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrar Usuario"
              name="user"
              value={user}
              onChange={(e) => handleOnChange(e)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              name="password"
              value={password}
              minLength="6"
              onChange={(e) => handleOnChange(e)}
              required
            />
          </Form.Group>
          <Form.Text className="text-muted">
            Never share your password with anyone.
          </Form.Text>
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrar un Rol"
              name="rol"
              value={rol}
              onChange={(e) => handleOnChange(e)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrar un estado"
              name="estado"
              value={estado}
              onChange={(e) => handleOnChange(e)}
              required
            />
          </Form.Group>
          <Form.Group className="d-flex">
            <Button variant="primary" onClick={(e) => handleOnSubmit(e)}>
              Actualizar
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
};
