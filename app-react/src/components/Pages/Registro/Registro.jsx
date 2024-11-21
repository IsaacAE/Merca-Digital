// Importación de imágenes y estilos
import gato from "../../../Images/cat.png";
import perro from "../../../Images/dog.png";
import arbol from "../../../Images/tree.png";
import '../CSS/Registro.css';
import '../CSS/Form.css';

// Importación de herramientas para navegación y utilidades
import { useNavigate, NavLink } from "react-router-dom";
import SHA256 from 'crypto-js/sha256';
import { Success, Error } from "../../Swal/Swal";

// Función para realizar el hash de la contraseña
function hashPassword(password) {
    let hashed = SHA256(password).toString();
    // Limitar el hash a un máximo de 50 caracteres
    return hashed.length > 50 ? hashed.slice(0, 50) : hashed;
}

// Componente principal del registro
export default function Registro() {
    const navigate = useNavigate(); // Hook para redirección

    // Manejo del envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Evita recarga de página
        const nombre = e.target.nombre.value;
        const apPat = e.target.apPat.value;
        const apMat = e.target.apMat.value;
        const correo = e.target.correo.value;
        const telefono = e.target.telefono.value;
        const msg_password = e.target.contraseña.value; // Contraseña en texto plano (para enviar por correo)
        const contraseña = hashPassword(e.target.contraseña.value); // Contraseña encriptada
        let imagen = e.target.imagen.value;
        let tipoCuenta = e.target.tipoCuenta.value;

        // Asignación de imagen de perfil basada en la selección
        imagen = imagen === '1' ? gato : imagen === '2' ? perro : arbol;

        // Conversión del tipo de cuenta a un valor numérico
        tipoCuenta = tipoCuenta === 'option1' ? 0 : 1;

        // Llamada a la función de registro
        registro(nombre, apPat, apMat, correo, telefono, contraseña, imagen, tipoCuenta, msg_password);
    }

    // Función para realizar el registro a través de una petición POST
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

        try {
            const response = await fetch(`http://localhost:5000/usuario/create`, {
                method: 'POST',
                body: formdata
            }).then(response => response.json());

            if (response.error) {
                // Mostrar mensaje de error en base al tipo
                Error(response.error);
            } else {
                Success('Usuario creado correctamente');
                enviar_correo(nombre, correo, msg_password); // Envío de correo
                navigate('/'); // Redirección al inicio
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            Error('Ocurrió un error inesperado, inténtalo más tarde');
        }
    }

    // Función para enviar el correo de confirmación
    const enviar_correo = async (nombre, correo, msg_password) => {
        const formdata = new FormData();
        formdata.append('nombre', nombre);
        formdata.append('correo', correo);
        formdata.append('contraseña', msg_password);

        try {
            const response = await fetch(`http://localhost:5000/correos/cuenta`, {
                method: 'POST',
                body: formdata
            }).then(response => response.json());

            if (response.error) {
                Error('No se pudo enviar el correo');
            }
        } catch (error) {
            console.error('Error en el envío de correo:', error);
            Error('Ocurrió un error inesperado, inténtalo más tarde');
        }
    }

    // Función para regresar a la página anterior
    const goBack = () => {
        navigate(-1);
    }

    return (
        <>
            <div className="fullscreen-shape"></div>
            <button type="button" className="btn-regresar" onClick={goBack}>
                <i className="bi bi-arrow-left" />
            </button>
            <h1 className="text-white">Registro de usuario</h1>
            <form className="m-5" onSubmit={handleSubmit}>
                <fieldset className="container">
                    <legend className="mt-4">Datos personales</legend>
                    {/* Campos de entrada */}
                    ...
                </fieldset>
            </form>
        </>
    );
}

