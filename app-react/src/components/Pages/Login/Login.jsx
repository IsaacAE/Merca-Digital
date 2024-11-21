import { useNavigate } from "react-router-dom"; // Importa el hook para la navegación
import { useCookies } from 'react-cookie'; // Hook para gestionar las cookies
import SHA256 from 'crypto-js/sha256'; // Librería para cifrar la contraseña con SHA256
import { Success, Error, Alert } from "../../Swal/Swal"; // Importa funciones para mostrar alertas
import { NavLink } from "react-router-dom"; // Para los enlaces de navegación
import './Login.css'; // Importa los estilos del componente

export default function Login() {
    const navigate = useNavigate(); // Hook para navegar entre rutas
    const [cookies, setCookie] = useCookies(['userToken']); // Hook para acceder y gestionar cookies

    // Función para cifrar la contraseña utilizando SHA256
    function hashPassword(password) {
        let hashed = SHA256(password).toString(); // Cifra la contraseña
        if (hashed.length > 50) {
            return hashed.slice(0, 50); // Si el hash es muy largo, lo corta a 50 caracteres
        }
        return hashed; // Devuelve el hash
    }

    // Función para manejar el submit del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        const correo = e.target.correo.value; // Obtiene el correo ingresado
        const contraseña = hashPassword(e.target.contraseña.value); // Cifra la contraseña ingresada
        login(correo, contraseña); // Llama a la función login
    }

    // Función para hacer la petición de login al servidor
    const login = async (correo, contraseña) => {
        const formdata = new FormData(); // Crea un objeto FormData
        formdata.append('correo', correo); // Agrega el correo al FormData
        formdata.append('contraseña', contraseña); // Agrega la contraseña al FormData
        
        try {
            // Realiza la petición HTTP al backend
            const response = await fetch(`http://localhost:5000/usuario/login`, {
                method: 'POST', // Usa el método POST
                body: formdata // El cuerpo de la petición contiene el FormData con las credenciales
            }).then((response) => response.json()) // Convierte la respuesta a JSON
            .then((data) => {
                console.log(data); // Muestra los datos de la respuesta en la consola

                try {
                    if (data['error'] === "usuario_incorrecto") {
                        // Si el usuario no existe, muestra un error
                        Error("Usuario inexistente");
                    } else if (data['error'] === "contraseña_incorrecta") {
                        // Si la contraseña es incorrecta, muestra un error
                        Error("Contraseña incorrecta");
                    } else {
                        // Si el login es exitoso, guarda los datos del usuario y redirige
                        setCookie('userToken', data.correo, { path: '/', maxAge: 3600 * 24 * 7 });
                        setCookie('user', data, { path: '/', maxAge: 3600 * 24 * 7 });
                        navigate('/home', data); // Redirige al home
                    }
                } catch (error) {
                    console.log(error); // En caso de error al procesar la respuesta
                }
            });
        } catch (error) {
            console.log('Error en la petición'); // Si ocurre un error con la petición
            console.log(error); // Muestra el error en la consola
            Alert('Ocurrió un error inesperado, inténtalo más tarde'); // Muestra un alerta
        }
    }

    // Función para regresar a la página anterior
    const goBack = () => {
        navigate(-1); // Regresa a la página anterior en el historial
    }

    return (
        <>
            <div className="fullscreen-shape"></div> {/* Fondo de pantalla */}
            <button type="button" className="btn-regresar" onClick={goBack}><i className="bi bi-arrow-left" /></button> {/* Botón para regresar */}
            <h1 className="text-white">Login</h1> {/* Título */}
            <form className='m-5' onSubmit={handleSubmit}> {/* Formulario */}
                <fieldset>
                    {/* Campo de correo */}
                    <div>
                        <label htmlFor="correo" className="form-label mt-4">Correo electrónico</label>
                        <input type="email" className="form-control" id="correo" aria-describedby="emailHelp" placeholder="correo@ejemplo.com" required />
                    </div>

                    {/* Campo de contraseña */}
                    <div>
                        <label htmlFor="contraseña" className="form-label mt-4">Contraseña</label>
                        <input type="password" className="form-control" id="contraseña" placeholder="Contraseña" autoComplete="off" required />
                    </div>

                    {/* Botón de submit */}
                    <div className='text-center'>
                        <button type="submit" className="btn btn-azul mt-5">Login</button>
                    </div>
                    
                </fieldset>
            </form>
        </>
    );
}

