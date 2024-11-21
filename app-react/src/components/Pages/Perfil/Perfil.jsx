import { useCookies } from "react-cookie"
import { useState, useEffect} from "react";
import {Success, Error} from "./../../Swal/Swal"
import axios from "axios";
import "./Perfil.css"
import { useNavigate } from "react-router-dom";

export default function Perfil(){

    const [cookies, setCookie] = useCookies()
    const [profile, setProfile] = useState(cookies.user);
    const [editingField, setEditingField] = useState(null);
    const [editingValue, setEditingValue] = useState(null);
    const [idUsuario, setIdUsuario] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        if( profile.vendedor === 0){
            setIdUsuario(profile.idComprador)
        }else{
            setIdUsuario(profile.idUsuario)
        }
    })
    
    const handleEditClick = (field) => {
        if(editingField === field){
            setEditingField(null);
            setEditingValue(null);
        }else{
            setEditingField(field);
            setEditingValue(profile[field]);
        }
    };
    
    const handleSaveClick = () => {
        axios.put(`http://localhost:5000/usuario/updateNombre/${idUsuario}`, profile)
        .then(response => {
        setEditingField(null);
        })
        .catch(error => console.error('Error updating data:', error));
    };

    const handleChange = (e) => {
        setEditingValue(e.target.value)
    }

    const init_edit = () => {
        setEditingField(null)
        setEditingValue(null)
    } 

    const edit_nombre = () => {
        if(profile.nombre === editingValue){
            init_edit()
            return
        }
            
        axios.post(`http://localhost:5000/usuario/updateNombre/${idUsuario}/${editingValue}`).then(
            response => {
                if(response['error']){
                    Error('Error al actualizar el nombre')
                } else{
                    setProfile({...profile, nombre: editingValue})
                    const updated = {...cookies.user, nombre: editingValue}
                    setCookie('user', updated, {path: '/'})
                    Success('Nombre actualizado correctamente')

                }
                init_edit()
            }
        ).catch(error => console.error('Error al actualizar el nombre', error))
    }

    const edit_apPat = () => {
        if(profile.apPat === editingValue){
            init_edit()
            return
        }
            
        axios.post(`http://localhost:5000/usuario/updateApPat/${idUsuario}/${editingValue}`).then(
            response => {
                if(response['error']){
                    Error('Error al actualizar el apellido')
                } else{
                    setProfile({...profile, apPat: editingValue})
                    const updated = {...cookies.user, apPat: editingValue}
                    setCookie('user', updated, {path: '/'})
                    Success('Apellido actualizado correctamente')
                }
                init_edit()
            }
        ).catch(error => console.error('Error al actualizar el apellido', error))
    }

    const edit_apMat = () => {
        if(profile.apMat === editingValue){
            init_edit()
            return
        }
            
        axios.post(`http://localhost:5000/usuario/updateApMat/${idUsuario}/${editingValue}`).then(
            response => {
                if(response['error']){
                    Error('Error al actualizar el apellido')
                } else{
                    setProfile({...profile, apMat: editingValue})
                    const updated = {...cookies.user, apMat: editingValue}
                    setCookie('user', updated, {path: '/'})
                    Success('Apellido actualizado correctamente')
                }
                init_edit()
            }
        ).catch(error => console.error('Error al actualizar el apellido', error))
    }

    const edit_correo = () => {
        if(profile.correo === editingValue){
            init_edit()
            return
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
        if(profile.telefono === editingValue){
            init_edit()
            return
        }
            
        axios.post(`http://localhost:5000/usuario/updateTelefono/${idUsuario}/${editingValue}`).then(
            response => {
                if(response['error']){
                    Error('Error al actualizar el telefono')
                } else{
                    setProfile({...profile, telefono: editingValue})
                    const updated = {...cookies.user, telefono: editingValue}
                    setCookie('user', updated, {path: '/'})
                    Success('Telefono actualizado correctamente')
                }
                init_edit()
            }
        ).catch(error => console.error('Error al actualizar el telefono', error))
    }

    const goBack = () => {
        navigate(-1)
    }

    //console.log(cookies.user)

    return (
        <>
        <button type="button" className="btn-regresar" onClick={goBack}><i className="bi bi-arrow-left"/></button>

        <div className="profile-container">
          <div className="fullscreen-shape"></div>

          <h1 className="text-white">Perfil de Usuario</h1>
          
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
            {editingField && editingField==="nombre" &&(
                <button className="btn btn-azul" onClick={edit_nombre}>Guardar</button>
            )}
          </div>

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
            {editingField && editingField==="apPat" &&(
                <button className="btn btn-azul" onClick={edit_apPat}>Guardar</button>
            )}
          </div>

          <div className="profile-field">
            <label>Apellido Materno:</label>
            {editingField === "apMat" ? (
              <input
                type="text"
                name="apMat"
                defaultValue={profile.apMat}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.apMat}</span>
            )}
            <button onClick={() => handleEditClick("apMat")}>
              <i className="bi bi-pencil"></i>
            </button>
            {editingField && editingField==="apMat" &&(
                <button className="btn btn-azul" onClick={edit_apMat}>Guardar</button>
            )}
          </div>

          <div className="profile-field">
            <label>Correo:</label>
            {editingField === "correo" ? (
              <input
                type="email"
                name="correo"
                defaultValue={profile.correo}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.correo}</span>
            )}
            <button onClick={() => handleEditClick("correo")}>
              <i className="bi bi-pencil"></i>
            </button>
            {editingField && editingField==="correo" &&(
                <button className="btn btn-azul" onClick={edit_correo}>Guardar</button>
            )}
          </div>

          <div className="profile-field">
            <label>Telefono</label>
            {editingField === "telefono" ? (
              <input
                type="text"
                name="telefono"
                defaultValue={profile.telefono}
                onChange={handleChange}
                pattern="[0-9]{10}"
              />
            ) : (
              <span>{profile.telefono}</span>
            )}
            <button onClick={() => handleEditClick("telefono")}>
              <i className="bi bi-pencil"></i>
            </button>
            {editingField && editingField==="telefono" &&(
                <button className="btn btn-azul" onClick={edit_telefono}>Guardar</button>
            )}
          </div>

        </div>
        </>
      );
}



 
