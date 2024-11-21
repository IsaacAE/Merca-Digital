import './Home.css'; // Importa los estilos del componente
import { useCookies } from 'react-cookie'; // Hook para trabajar con cookies
import { useEffect } from 'react'; // Hook de React para ejecutar efectos secundarios
import { useNavigate } from 'react-router-dom'; // Hook para la navegación
import image from "../../../Images/logo2.png" // Importa la imagen del logo
import { NavLink } from 'react-router-dom'; // Importa NavLink para la navegación de enlaces

export function Home() {

  // Hook para gestionar cookies (en este caso, la cookie 'user' que se almacena al iniciar sesión)
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const navigate = useNavigate(); // Hook para navegar entre páginas

  // useEffect que se ejecuta cuando el componente se monta
  useEffect(() => {
    // Si el usuario ya tiene una cookie de 'user', redirige automáticamente a la página principal
    if(cookies.user){
      navigate('/home');
    }
  }, [cookies, navigate]); // El efecto depende de las cookies y de la función navigate

  return (
    <>
      <div className='fullscreen-shape'></div> {/* Fondo con forma */}
      <h1 className='text-white'>Bienvenido a Merca-Digital</h1> {/* Título principal */}
      <div className='text-center'>
        <img src={image} alt="imagen" className='custom-image' /> {/* Imagen del logo */}
      </div>
      <div className='text-center'>
        <p className='text-white mt-5 fs-3'>Tu tienda virtual de la facultad de Ciencias</p> {/* Descripción de la tienda */}
        <p className='text-white mt-5 fs-5'>
          {/* Enlaces para iniciar sesión o registrarse */}
          <NavLink to="/login" className="link">Inicia sesión</NavLink> o 
          <NavLink to="/registro" className="link">registrate</NavLink> 
          para comenzar a comprar
        </p>
      </div>
    </>
  );
}

