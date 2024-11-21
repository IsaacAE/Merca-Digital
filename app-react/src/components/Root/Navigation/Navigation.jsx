// Importa los archivos de estilo y las dependencias necesarias
import './Navigation.css'
import { NavLink } from 'react-router-dom';  // Para crear enlaces de navegación
import { useCookies } from 'react-cookie';  // Para manejar las cookies de sesión
import logo from "../../../Images/logo2.png"  // Logo de la tienda

export default function Navigation(){
    // Desestructuración para acceder a las cookies
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    // Función para cerrar sesión
    const handleLogout = () => {
        // Elimina las cookies 'userToken' y 'user' al cerrar sesión
        removeCookie('userToken');
        removeCookie('user');
        try{
            // Llama al endpoint para cerrar sesión en el servidor
            const response = fetch(`http://localhost:5000/usuario/logout`).then(
                (response) => console.log(response));
            
        }catch(error){
            // En caso de error en la solicitud, muestra un mensaje en la consola
            console.log('Error en la petición logout');
            console.log(error);
            alert('Ocurrió un error inesperado, inténtalo más tarde')
        }
    }

    return(
        <>
        {/* Barra de navegación */}
        <nav className="navbar navbar-expand-lg navegacion" data-bs-theme="dark">
          <div className="container-fluid">
            {/* Logo de la tienda */}
            <a className="navbar-brand marca" ><img src={logo} className='logo'/>Prometienda</a>
            {/* Botón para dispositivos móviles */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarColor01">
              <ul className="navbar-nav me-auto">
                {/* Si el usuario está autenticado, muestra la opción 'Home' */}
                {cookies.user && (
                <li className="nav-item">
                  <NavLink to="/home" className="nav-link">Home</NavLink>
                </li>
                )}
                
                {/* Enlace a la sección de productos */}
                <li className="nav-item">
                  <NavLink to="/productos/ver" className="nav-link">Productos</NavLink>
                </li>

                {/* Si no hay usuario autenticado, muestra las opciones de registro e inicio de sesión */}
                {!cookies.user && (
                  <div className='d-flex registro opc-reg'>
                    <li className="nav-item">
                      <NavLink to="/registro" className="nav-link">Registrarse</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/login" className="nav-link">Login</NavLink>
                    </li>
                  </div>
                )}
              </ul>

              {/* Si hay un usuario autenticado, muestra el carrito y las opciones del perfil */}
              {cookies.user && (
                <div className='d-flex'>
                  {/* Si el usuario es comprador (vendedor === 0), muestra el carrito */}
                  {cookies.user['vendedor']==0 &&
                    <li className="carrito">
                      <NavLink to="/carrito" className="nav-link"><i className="bi bi-cart4 tam"></i></NavLink>
                    </li>
                  }
                  {/* Menú desplegable para el perfil del usuario */}
                  <div className='foto'>
                      <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                        {/* Imagen del perfil del usuario */}
                        <img src={cookies.user.imagen} alt="Imagen de perfil" className="imagen-perfil" />
                      </a>
                      <div className="dropdown-menu  position-dropdown">
                        {/* Enlaces de perfil, compras y cerrar sesión */}
                        <NavLink to="/perfil" className="dropdown-item">Ver perfil</NavLink>
                        {cookies.user['vendedor']===0 &&(<NavLink to="/misCompras" className="dropdown-item">Mis compras</NavLink>)}
                        <NavLink to="/" className="dropdown-item" onClick={handleLogout}>Cerrar sesión</NavLink>
                      </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </>
    )
}

