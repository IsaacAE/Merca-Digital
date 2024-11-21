import { useEffect, useState } from "react"
import { NavLink, useLocation, useParams, useNavigate } from "react-router-dom";
import { agregarAlCarrito, cambiarCantidad } from "../Carrito/Carrito";
import { useCookies } from "react-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import logo from '../../../Images/logo.png'
import StarRating from "../Resenias/StarRating.jsx";
import './Detalle.css'

export default function Detalle() {

    const navigate = useNavigate()

    const { carrito } = useParams();
    const { product } = useParams();
    const producto = decodeURIComponent(product)
    const jsonDataObject = JSON.parse(producto)

    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
    const [contacto, setContacto] = useState("");
    const [numero, setNumero] = useState(1);
    const [opiniones, setOpiniones] = useState(null);
    const [cant, setCant] = useState(jsonDataObject.cantidad_carrito ? jsonDataObject.cantidad_carrito : 1)

    const vendedor = cookies.user && cookies.user['vendedor'] === 1;

    useEffect(() => {
        axios.get(`http://localhost:5000/usuario/read/${jsonDataObject.idUsuario}`).then(response => {
            //console.log(response.data)
            var d = response.data;
            var cont = d['nombre'] + " " + d['apPat'] + " " + d['apMat']
            setContacto(cont)
        })

        axios.get(`http://localhost:5000/contener/opiniones/${jsonDataObject.idProducto}`).then(response => {
            const opiniones = response.data;
            const opinionesFiltradas = opiniones.map(opinion => ({
                calificacion: opinion.calificacion,
                comentario: opinion.comentario
            }));
            setOpiniones(opinionesFiltradas);
        }).catch(error => {
            console.error('Error fetching opinions:', error);
        });
    }, [jsonDataObject.idProducto]);


    function aumentar(limite) {
        if (numero + 1 <= limite) {
            setNumero(numero + 1)
        }
    }

    function disminuir() {
        if (numero - 1 > 0) {
            setNumero(numero - 1)
        }
    }

    function agregar() {
        let res = agregarAlCarrito(jsonDataObject.idProducto, cookies.user['idCarrito'], numero).then(response => {
            console.log(res)
        })
    }

    function poner() {
        if (cant < jsonDataObject.cantidad) {
            let res = cambiarCantidad(jsonDataObject.idProducto, cookies.user['idCarrito'], cant + 1)
            console.log(res)
            setCant(cant + 1)
        }
    }

    function quitar() {
        if (cant - 1 > 0) {
            let res = cambiarCantidad(jsonDataObject.idProducto, cookies.user['idCarrito'], cant - 1)
            console.log(res)
            setCant(cant - 1)
        }
    }

    const goBack = () => {
        navigate(-1)
    }

    const eliminar = (idProducto) =>{
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: true,
            confirmButtonColor: '#8a73c2',
            iconColor: '#8a73c2'
          });
          swalWithBootstrapButtons.fire({
            title: "Estás seguro de eliminar este producto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí!",
            cancelButtonText: "No!",
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                navigate(`/productos/eliminar/${idProducto}`)
            } 
          });
    }

    return(
       
            <>
                <div className="fullscreen-shape"></div>
                <button type="button" className="btn-regresar" onClick={goBack}><i className="bi bi-arrow-left"/></button>
                <section className="py-5">
                    <div className="container px-4 px-lg-5 my-5">
                        <div className="row gx-4 gx-lg-5 align-items-center">
                            <div className="col-md-6"><img className="card-img-top mb-5 mb-md-0 img-product" src={jsonDataObject.fotourl} alt="..." /></div>
                            <div className="col-md-6">
                                <div className="small">ID: {jsonDataObject.idProducto}</div>
                                <h1 className="display-5 fw-bolder">{jsonDataObject.nombreProducto}</h1>
                                <div className="fs-5 mb-5">
                                    <span>${jsonDataObject.precio}</span>
                                </div>
                                <p className="lead">{jsonDataObject.descripcion}</p>
                                <p>Contacto: {jsonDataObject.contacto}</p>
                                <p>Publicación de: <NavLink to={`/galeria/${jsonDataObject.idUsuario}`} className="link">{contacto}</NavLink></p>
                                    
                                {cookies.user && !vendedor && 
                                    <div className="d-flex">
                                    
                                    {carrito==="true" &&
                                        <>
                                            <button className="btn btn-azul" onClick={() => quitar()}>-</button>
                                            <p className="m-3">{cant}</p>
                                            <button className="btn btn-azul" onClick={() => poner()}>+</button>
                                        </>
                                    }
                                    {carrito === "false" &&
                                        <>
                                            <button className="btn btn-azul" onClick={() => disminuir()}>-</button>
                                            <p className="m-4">{numero}</p>
                                            <button className="btn btn-azul" onClick={() => aumentar(jsonDataObject.cantidad)}>+</button>
                                        </>
                                    }

                                    {carrito === "false" &&
                                        <button className="btn btn-outline-dark flex-shrink-0 m-3" type="button" onClick={() => agregar()}>
                                            <i className="bi-cart-fill me-1"></i>
                                            Agregar al carrito
                                        </button>

                                    }
                                </div>
                            }

                            <p>Existencias: {jsonDataObject.cantidad}</p>

                                {vendedor &&(
                                    <div>
                                        <NavLink to={`/productos/actualizar/${jsonDataObject.idProducto}`} className={'editar m-2'}><i class="bi bi-pencil-square"/> Editar</NavLink>
                                        <button onClick={()=>eliminar(jsonDataObject.idProducto)} className="eliminar"><i class="bi bi-trash3"/>Eliminar </button>
                                    </div>
                                )}

                                {!cookies.user && (
                                    <p><NavLink to="/login" className='link'>Inicia sesión </NavLink>para comprar este producto</p>
                                
                                )}
                                
                            </div>
                            
                        </div>
                        
                    </div>
                </section>
                
                <section className="py-5 bg-gris">
                    <div className="container px-4 px-lg-5 mt-5">
                        <h2 className="fw-bolder mb-4 text-white">Reseñas</h2>
                        <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                            {opiniones && opiniones.slice(0, 3).map((opinion, index) => (
                                <div className="col mb-5" key={index}>
                                    <div className="card h-100">
                                        <img className="card-img-top" src={logo} alt="..." />
                                        <div className="card-body p-4">
                                            <div className="text-center">
                                                <h5 className="fw-bolder">Reseña: {index + 1}</h5>
                                                <p>{opinion.comentario}</p>
                                                <div>
                                                    {Array.from({ length: opinion.calificacion }, (_, i) => (
                                                        <span key={i}>&#9733;</span> // Imprime el símbolo de estrella
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                        
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={'text-center'} >
                        <NavLink to={`/resenias/ver/${jsonDataObject.idProducto}`} className={'btn btn-outline-light mt-auto'}> Ver más</NavLink>
                        </div>
                    </div>
                </section>

        </>

    )
}