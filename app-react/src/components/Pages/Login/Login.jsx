import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import SHA256 from 'crypto-js/sha256';
import { Success, Error, Alert } from "../../Swal/Swal";
import { NavLink } from "react-router-dom";
import './Login.css'

export default function Login() {

    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['userToken']);

    function hashPassword(password){
        let hashed = SHA256(password).toString();
        if(hashed.length > 50){
            return hashed.slice(0, 50);
        }
        return hashed;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const correo = e.target.correo.value;
        const contraseña = hashPassword(e.target.contraseña.value);
        login(correo, contraseña);
    }

    const login = async (correo, contraseña) => {
        const formdata = new FormData();
        formdata.append('correo', correo);
        formdata.append('contraseña', contraseña);
        try{
            const response = await fetch(`http://localhost:5000/usuario/login`, {
                method: 'POST',
                body: formdata
            }).then((response) => response.json()).then((data) => {
                console.log(data);
                try{
                    if(data['error'] === "usuario_incorrecto"){
                        //alert("Usuario inexistente");
                        Error("Usuario inexistente");
                    }else if(data['error'] === "contraseña_incorrecta"){
                          //alert("Contraseña incorrecta");
                            Error("Contraseña incorrecta");
                    }else{
                        setCookie('userToken', data.correo, { path: '/', maxAge: 3600 * 24 * 7 });
                        setCookie('user', data, { path: '/', maxAge: 3600 * 24 * 7 });
                        navigate('/home', data)
                    }
                }catch(error){
                    console.log(error);
                }
            });
            
        }catch(error){
            console.log('Error en la petición');
            console.log(error);
            //alert('Ocurrió un error inesperado, inténtalo más tarde')
            Alert('Ocurrió un error inesperado, inténtalo más tarde');
        }
    }

    const goBack = () => {
        navigate(-1);
    }

    return (
        <>
            <div className="fullscreen-shape"></div>
            <button type="button" className="btn-regresar" onClick={goBack}><i className="bi bi-arrow-left"/></button>
            <h1 className="text-white">Login</h1>
            <form className='m-5' onSubmit={handleSubmit}>
                <fieldset>
                    <div>
                    <label htmlFor="correo" className="form-label mt-4">Correo electrónico</label>
                    <input type="email" className="form-control" id="correo" aria-describedby="emailHelp" placeholder="correo@ejemplo.com" required/>
                    </div>
                    <div>
                    <label htmlFor="contraseña" className="form-label mt-4">Contraseña</label>
                    <input type="password" className="form-control" id="contraseña" placeholder="Contraseña" autoComplete="off" required/>
                    </div>
                    <div className='text-center'>
                    <button type="submit" className="btn btn-azul mt-5">Login</button>
                    </div>
                    
                </fieldset>
            </form>
        </>
    );
}
