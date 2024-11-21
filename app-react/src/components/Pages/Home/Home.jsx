import './Home.css';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import image from "../../../Images/logo2.png"
import { NavLink } from 'react-router-dom';

export function Home() {

  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const navigate = useNavigate();

  useEffect(() => {
    if(cookies.user){
      navigate('/home')
    }
  },[])


  return (
    <>
    <div className='fullscreen-shape'></div>
      <h1 className='text-white'>Bienvenido a Prometienda</h1>
      <div className='text-center'>
        <img src={image} alt="imagen" className='custom-image'/>
      </div>
      <div className='text-center'>
        <p className='text-white mt-5 fs-3'>Tu tienda virtual de la facultad de Ciencias</p>
        <p className='text-white mt-5 fs-5'><NavLink to="/login" className="link">Inicia sesión</NavLink> o <NavLink to="/registro" className="link">registrate</NavLink> para comenzar a comprar</p>
      </div>

    </>
  );
}