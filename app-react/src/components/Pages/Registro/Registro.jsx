import gato from "../../../Images/cat.png";
import perro from "../../../Images/dog.png";
import arbol from "../../../Images/tree.png";
import '../CSS/Registro.css';
import '../CSS/Form.css'
import { useNavigate, NavLink } from "react-router-dom";
import SHA256 from 'crypto-js/sha256';
import { Success, Error } from "../../Swal/Swal";

function hashPassword(password){
    let hashed = SHA256(password).toString();
    if(hashed.length > 50){
        return hashed.slice(0, 50);
    }
    return hashed;
}

export default function Registro() {

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const nombre = e.target.nombre.value;
        const apPat = e.target.apPat.value;
        const apMat = e.target.apMat.value;
        const correo = e.target.correo.value;
        const telefono = e.target.telefono.value;
        const msg_password = e.target.contraseña.value;
        const contraseña = hashPassword(e.target.contraseña.value);
        let imagen = e.target.imagen.value;
        let tipoCuenta = e.target.tipoCuenta.value;

        if(imagen === '1'){
            imagen = gato;
        } else if(imagen === '2'){
            imagen = perro;
        } else {
            imagen = arbol;
        }

        if(tipoCuenta === 'option1'){
            tipoCuenta = 0;
        } else {
            tipoCuenta = 1;
        }
        
        console.log(nombre, apPat, apMat, correo, telefono, contraseña, imagen, tipoCuenta);

        registro(nombre, apPat, apMat, correo, telefono, contraseña, imagen, tipoCuenta, msg_password);

    }

    const registro = async (nombre, apPat, apMat, correo, telefono, contraseña, imagen, tipoCuenta, msg_password) => {
        const formdata = new FormData();
        formdata.append('nombre', nombre);
        formdata.append('apPat', apPat);
        formdata.append('apMat', apMat);
        formdata.append('correo', correo);
        formdata.append('telefono', telefono);
        formdata.append('contraseña', contraseña);
        formdata.append('imagen', imagen);
        formdata.append('tipoCuenta', tipoCuenta);

        try{
            const response = await fetch(`http://localhost:5000/usuario/create`, {
                method: 'POST',
                body: formdata
            }).then((response) => response.json()).then((data) => {
                console.log(data);
                try{
                    if(data['error'] === "No se pudo crear el usuario"){
                        //alert("No se pudo crear el usuario");
                        Error('No se pudo crear el usuario')
                    } else if(data['error']==="Ese correo ya esta registrado"){
                        Error('Ese correo ya está registrado')
        
                      }else if(data['error'] === 'Faltan datos'){
                        Error('Faltan datos')
                        //alert("Faltan datos");
                    }else{
                        Success('Usuario creado correctamente')
                        //alert('Usuario creado correctamente')
                        enviar_correo(nombre, correo,msg_password);
                        console.log(data);
                        navigate('/')
                    }
                }catch(error){
                    console.log(error);
                }
            });
            
        }catch(error){
            console.log('Error en la petición');
            console.log(error);
            Error('Ocurrió un error inesperado, inténtalo más tarde')
            //alert('Ocurrió un error inesperado, inténtalo más tarde')
        }
    }


    const enviar_correo = async (nombre,correo, msg_password) => {
        const formdata = new FormData();
        formdata.append('nombre', nombre);
        formdata.append('correo', correo);
        formdata.append('contraseña', msg_password);

        try{
            const response = await fetch(`http://localhost:5000/correos/cuenta`, {
                method: 'POST',
                body: formdata
            }).then((response) => response.json()).then((data) => {
                console.log(data);
                try{
                    if(data['error'] ){
                        
                        Error('No se pudo enviar el correo')
                    }
                }catch(error){
                    console.log(error);
                }
            });
            
        }catch(error){
            console.log('Error en la petición');
            console.log(error);
            Error('Ocurrió un error inesperado, inténtalo más tarde')
          
        }
    }

    const goBack = () => {
        navigate(-1)
    }
    
    return(
        < >
        <div className="fullscreen-shape"></div>
        <button type="button" className="btn-regresar" onClick={goBack}><i className="bi bi-arrow-left"/></button>
        <h1 className="text-white">Registro de usuario</h1>
        <form className='m-5' onSubmit={handleSubmit}>
            <fieldset className="container">
            <legend className="mt-4">Datos personales</legend>

            <div className="row">
                <div className="col-6">
                    <label htmlFor='nombre' className='form-label'>Nombre</label>
                    <input type='text' className='form-control' id='nombre' placeholder='Tu nombre aquí' pattern="[A-Za-záéíóúÁÉÍÓÚñÑ\s]+" maxLength={50} required/>
                </div>
                <div className="col-6">
                    <label htmlFor='apPat' className='form-label'>Apellido paterno</label>
                    <input type='text' className='form-control' id='apPat' placeholder='Tu apellido aquí' pattern="[A-Za-záéíóúÁÉÍÓÚñÑ\s]+" maxLength={50} required/>
                </div>
                <div className="col-6">
                    <label htmlFor='apMat' className='form-label'>Apellido materno</label>
                    <input type='text' className='form-control' id='apMat' placeholder='Tu apellido aquí' pattern="[A-Za-záéíóúÁÉÍÓÚñÑ\s]+" maxLength={50} required/>
                </div>
                <div className="col-6">
                    <label htmlFor="correo" className="form-label">Correo electrónico</label>
                    <input type="email" className="form-control" id="correo" aria-describedby="emailHelp" placeholder="correo@ejemplo.com" required/>
                </div>
                <div className="col-6">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input type="tel" className="form-control" id="telefono" placeholder="Teléfono" pattern="[0-9]{10}" required/>
                </div>
                <div className="col-6">
                    <label htmlFor="contraseña" className="form-label">Contraseña</label>
                    <input type="password" className="form-control" id="contraseña" placeholder="Contraseña" autoComplete="off" required/>
                </div>
            </div>
                    <label htmlFor="imagen" className="form-label mt-4">Imagen de perfil</label>
                    <div className="radio">
                    <div>
                        <input className="form-check-input" type='radio' name='imagen' id='imagen1' value='1' defaultChecked/>
                        <img src={gato} alt='Gato' className='imagen-perfil'/>
                    </div>
                    <div>
                        <input className="form-check-input" type='radio' name='imagen' id='imagen2' value='2'/>
                        <img src={perro} alt='Perro' className='imagen-perfil'/>
                    </div>
                    <div>
                        <input className="form-check-input" type='radio' name='imagen' id='imagen3' value='3'/>
                        <img src={arbol} alt='Arbol' className='imagen-perfil'/>
                    </div>
                </div>
                <fieldset>
                <legend className="mt-4">Tipo de cuenta</legend>
                <div className="form-check">
                    <div>
                    <input className="form-check-input" type="radio" name="tipoCuenta" id="tipoCuenta1" value="option1" defaultChecked/>
                    <label className="form-check-label" htmlFor="tipoCuenta1">
                        Cliente
                    </label>
                    </div>
                    <div>
                    <input className="form-check-input" type="radio" name="tipoCuenta" id="tipoCuenta2" value="option2"/>
                    <label className="form-check-label" htmlFor="tipoCuenta2">
                        Vendedor
                    </label>
                    </div>
                </div>
                </fieldset>
                <div className='text-center'>
                <button type="submit" className="btn btn-azul mt-5">Registrarse</button>
                </div>
            </fieldset>
        </form>
        </>
    )
}