import { useCookies } from "react-cookie"; // Hook para manejar cookies
import { useState, useEffect } from "react"; // Hooks para estado y efectos
import { Success, Error } from "./../../Swal/Swal"; // Funciones de notificación
import axios from "axios"; // Cliente HTTP para hacer solicitudes
import "./Perfil.css"; // Estilos CSS para el perfil
import { useNavigate } from "react-router-dom"; // Hook para la navegación

export default function Perfil() {

    // Hooks de estado
    const [cookies, setCookie] = useCookies(); // Accede a las cookies del usuario
    const [profile, setProfile] = useState(cookies.user); // Perfil del usuario, inicializado desde las cookies
    const [editingField, setEditingField] = useState(null); // Campo que está siendo editado
    const [editingValue, setEditingValue] = useState(null); // Valor que se está editando
    const [idUsuario, setIdUsuario] = useState(null); // ID del usuario

    const navigate = useNavigate(); // Hook de navegación

    // useEffect que configura el ID del usuario dependiendo de si es vendedor o comprador
    useEffect(() => {
        if (profile.vendedor === 0) {
            setIdUsuario(profile.idComprador);
        } else {
            setIdUsuario(profile.idUsuario);
        }
    }, [profile]); // Se ejecuta cuando el perfil cambia

    // Función para manejar la edición de un campo
    const handleEditClick = (field) => {
        if (editingField === field) {
            setEditingField(null);
            setEditingValue(null);
        } else {
            setEditingField(field);
            setEditingValue(profile[field]);
        }
    };

    // Función para guardar los cambios en el servidor
    const handleSaveClick = () => {
        axios.put(`http://localhost:5000/usuario/updateNombre/${idUsuario}`, profile)
            .then(response => {
                setEditingField(null);
            })
            .catch(error => console.error('Error updating data:', error));
    };

    // Función que maneja los cambios en los campos editables
    const handleChange = (e) => {
        setEditingValue(e.target.value);
    }

    // Función para resetear el estado de edición
    const init_edit = () => {
        setEditingField(null);
        setEditingValue(null);
    }

    // Funciones específicas para editar cada campo
    const edit_nombre = () => {
        if (profile.nombre === editingValue) {
            init_edit();
            return;
        }

        axios.post(`http://localhost:5000/usuario/updateNombre/${idUsuario}/${editingValue}`).then(
            response => {
                if (response['error']) {
                    Error('Error al actualizar el nombre');
                } else {
                    setProfile({ ...profile, nombre: editingValue });
                    const updated = { ...cookies.user, nombre: editingValue };
                    setCookie('user', updated, { path: '/' });
                    Success('Nombre actualizado correctamente');
                }
                init_edit();
            }
        ).catch(error => console.error('Error al actualizar el nombre', error));
    }

    const edit_apPat = () => {
        if (profile.apPat === editingValue) {
            init_edit();
            return;
        }

        axios.post(`http://localhost:5000/usuario/updateApPat/${idUsuario}/${editingValue}`).then(
            response => {
                if (response['error']) {
                    Error('Error al actualizar el apellido');
                } else {
                    setProfile({ ...profile, apPat: editingValue });
                    const updated = { ...cookies.user, apPat: editingValue };
                    setCookie('user', updated, { path: '/' });
                    Success('Apellido actualizado correctamente');
                }
                init_edit();
            }
        ).catch(error => console.error('Error al actualizar el apellido', error));
    }

    const edit_apMat = () => {
        if (profile.apMat === editingValue) {
            init_edit();
            return;
        }

        axios.post(`http://localhost:5000/usuario/updateApMat/${idUsuario}/${editingValue}`).then(
            response => {
                if (response['error']) {
                    Error('Error al actualizar el apellido');
                } else {
                    setProfile({ ...profile, apMat: editingValue });
                    const updated = { ...cookies.user, apMat: editingValue };
                    setCookie('user', updated, { path: '/' });
                    Success('Apellido actualizado correctamente');
                }
                init_edit();
            }
        ).catch(error => console.error('Error al actualizar el apellido', error));
    }

    const edit_correo = () => {
        if (profile.correo === editingValue) {
            init_edit();
            return;
        }

        axios.post(`http://localhost:5000/usuario/updateCorreo/${idUsuario}/${editingValue}`).then(
            response => {
                if (response.data.error === "Ese correo ya esta registrado") {
                    Error('Ese correo ya está registrado');
                } else if (response.data.error) {
                    Error('Error al actualizar el correo');
                } else {
                    setProfile({ ...profile, correo: editingValue });
                    const updated = { ...cookies.user, correo: editingValue };
                    setCookie('user', updated, { path: '/' });
                    Success('Correo actualizado correctamente');
                }
                init_edit();
            }
        ).catch(error => console.error('Error al actualizar el correo', error));
    };

    const edit_telefono = () => {
        if (profile.telefono === editingValue) {
            init_edit();
            return;
        }

        axios.post(`http://localhost:5000/usuario/updateTelefono/${idUsuario}/${editingValue}`).then(
            response => {
                if (response['error']) {
                    Error('Error al actualizar el telefono');
                } else {
                    setProfile({ ...profile, telefono: editingValue });
                    const updated = { ...cookies.user, telefono: editingValue };
                    setCookie('user', updated, { path: '/' });
                    Success('Telefono actualizado correctamente');
                }
                init_edit();
            }
        ).catch(error => console.error('Error al actualizar el telefono', error));
    }

    const goBack = () => {
        navigate(-1); // Regresa a la página anterior
    }

    return (
        <>
            <button type="button" className="btn-regresar" onClick={goBack}>
                <i className="bi bi-arrow-left" />
            </button>

            <div className="profile-container">
                <div className="fullscreen-shape"></div>

                <h1 className="text-white">Perfil de Usuario</h1>

                {/* Campos del perfil */}
                <div className="profile-field">
                    <label>Nombre:</label>
                    {editingField === "nombre" ? (
                        <input
                            type="text"
                            name="nombre"
                            defaultValue={profile.nombre}
                            onChange={handleChange}
                        />
                    ) : (
                        <span>{profile.nombre}</span>
                    )}
                    <button onClick={() => handleEditClick("nombre")}>
                        <i className="bi bi-pencil"></i>
                    </button>
                    {editingField && editingField === "nombre" && (
                        <button className="btn btn-azul" onClick={edit_nombre}>Guardar</button>
                    )}
                </div>

                {/* Similar for other fields */}
                <div className="profile-field">
                    <label>Apellido Paterno:</label>
                    {editingField === "apPat" ? (
                        <input
                            type="text"
                            name="apPat"
                            defaultValue={profile.apPat}
                            onChange={handleChange}
                        />
                    ) : (
                        <span>{profile.apPat}</span>
                    )}
                    <button onClick={() => handleEditClick("apPat")}>
                        <i className="bi bi-pencil"></i>
                    </button>
                    {editingField && editingField === "apPat" && (
                        <button className="btn btn-azul" onClick={edit_apPat}>Guardar</button>
                    )}
                </div>

                {/* Repetir para los demás campos: apMat, correo, telefono */}
            </div>
        </>
    );
}

