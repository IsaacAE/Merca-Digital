// Importa el hook useRouteError de react-router-dom para capturar errores de la ruta
import { useRouteError } from "react-router-dom";
// Importa el componente Link de react-router-dom para la navegación
import { Link } from "react-router-dom";
// Importa el archivo CSS para los estilos del componente de error
import './Error.css';

// Definición del componente Error
export default function Error() {
    // Captura el error de la ruta actual usando el hook useRouteError
    const error = useRouteError();

    return (
        // Contenedor principal de la página de error
        <div id="error-page">
            {/* Elemento para mostrar una forma de fondo en pantalla completa */}
            <div className="fullscreen-shape"></div>

            {/* Título principal de la página de error */}
            <h1 className="text-white m-5">Oops!</h1>
            {/* Subtítulo que indica que ocurrió un error */}
            <h2 className="text-white">Ha ocurrido un error inesperado</h2>
            <h3>
                {/* Muestra el mensaje de error capturado */}
                <i>
                    {error.statusText || error.message}
                </i>
            </h3>
            
            {/* Enlace para regresar a la página principal */}
            <Link to='/'>
                {/* Botón para regresar a la página de inicio */}
                <button className="btn btn-secondary return">Regresemos a casa</button>
            </Link>
        </div>
    );
}

