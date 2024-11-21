import { useEffect, useState } from "react"
import { NavLink, useLocation, useParams, useNavigate } from "react-router-dom"; // Hooks para navegación y obtención de parámetros
import { agregarAlCarrito, cambiarCantidad } from "../Carrito/Carrito"; // Funciones de carrito
import { useCookies } from "react-cookie"; // Hook para manejar cookies
import axios from "axios"; // Para hacer peticiones HTTP
import Swal from "sweetalert2"; // Para mostrar alertas personalizadas
import logo from '../../../Images/logo.png'; // Imagen de logo para las reseñas
import StarRating from "../Resenias/StarRating.jsx"; // Componente de estrellas de reseñas
import './Detalle.css'; // Estilos específicos del componente

export default function Detalle() {

    const navigate = useNavigate(); // Hook para navegación
    const { carrito } = useParams(); // Obtener el parámetro 'carrito' de la URL
    const { product } = useParams(); // Obtener el parámetro 'product' de la URL
    const producto = decodeURIComponent(product); // Decodificar el nombre del producto
    const jsonDataObject = JSON.parse(producto); // Parsear el string JSON para obtener los datos del producto

    const [cookies, setCookie, removeCookie] = useCookies(['userToken']); // Manejo de cookies, obtención del token del usuario
    const [contacto, setContacto] = useState(""); // Estado para almacenar el contacto del vendedor
    const [numero, setNumero] = useState(1); // Estado para manejar la cantidad de productos a agregar
    const [opiniones, setOpiniones] = useState(null); // Estado para almacenar las opiniones del producto
    const [cant, setCant] = useState(jsonDataObject.cantidad_carrito ? jsonDataObject.cantidad_carrito : 1); // Estado para la cantidad en el carrito

    const vendedor = cookies.user && cookies.user['vendedor'] === 1; // Verificar si el usuario es vendedor

    // useEffect para obtener el contacto del vendedor y las opiniones del producto
    useEffect(() => {
        // Obtener contacto del vendedor
        axios.get(`http://localhost:5000/usuario/read/${jsonDataObject.idUsuario}`).then(response => {
            var d = response.data;
            var cont = d['nombre'] + " " + d['apPat'] + " " + d['apMat'];
            setContacto(cont);
        });

        // Obtener opiniones del producto
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

    // Función para aumentar la cantidad en el carrito sin exceder el límite
    function aumentar(limite) {
        if (numero + 1 <= limite) {
            setNumero(numero + 1);
        }
    }

    // Función para disminuir la cantidad
    function disminuir() {
        if (numero - 1 > 0) {
            setNumero(numero - 1);
        }
    }

    // Función para agregar al carrito
    function agregar() {
        let res = agregarAlCarrito(jsonDataObject.idProducto, cookies.user['idCarrito'], numero).then(response => {
            console.log(res);
        });
    }

    // Función para aumentar la cantidad de un producto en el carrito
    function poner() {
        if (cant < jsonDataObject.cantidad) {
            let res = cambiarCantidad(jsonDataObject.idProducto, cookies.user['idCarrito'], cant + 1);
            console.log(res);
            setCant(cant + 1);
        }
    }

    // Función para disminuir la cantidad de un producto en el carrito
    function quitar() {
        if (cant - 1 > 0) {
            let res = cambiarCantidad(jsonDataObject.idProducto, cookies.user['idCarrito'], cant - 1);
            console.log(res);
            setCant(cant - 1);
        }
    }

    // Función para navegar hacia atrás
    const goBack = () => {
        navigate(-1);
    };

    // Función para eliminar un producto
    const eliminar = (idProducto) => {
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
                navigate(`/productos/eliminar/${idProducto}`);
            }
        });
    };

    return (
        <>
            {/* Fondo de pantalla */}
            <div className="fullscreen-shape"></div>

            {/* Botón para regresar a la página anterior */}
            <button type="button" className="btn-regresar" onClick={goBack}><i className="bi bi-arrow-left" /></button>

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

                            {/* Lógica para mostrar los botones dependiendo del estado del carrito */}
                            {cookies.user && !vendedor && 
                                <div className="d-flex">
                                    {carrito === "true" && <>
                                        <button className="btn btn-azul" onClick={() => quitar()}>-</button>
                                        <p className="m-3">{cant}</p>
                                        <button className="btn btn-azul" onClick={() => poner()}>+</button>
                                    </>}
                                    {carrito === "false" && <>
                                        <button className="btn btn-azul" onClick={() => disminuir()}>-</button>
                                        <p className="m-4">{numero}</p>
                                        <button className="btn btn-azul" onClick={() => aumentar(jsonDataObject.cantidad)}>+</button>
                                    </>}
                                    {carrito === "false" && 
                                        <button className="btn btn-outline-dark flex-shrink-0 m-3" type="button" onClick={() => agregar()}>
                                            <i className="bi-cart-fill me-1"></i>
                                            Agregar al carrito
                                        </button>
                                    }
                                </div>
                            }

                            <p>Existencias: {jsonDataObject.cantidad}</p>

                            {/* Si el usuario es vendedor, mostrar opciones para editar o eliminar el producto */}
                            {vendedor && (
                                <div>
                                    <NavLink to={`/productos/actualizar/${jsonDataObject.idProducto}`} className={'editar m-2'}>
                                        <i className="bi bi-pencil-square" /> Editar
                                    </NavLink>
                                    <button onClick={() => eliminar(jsonDataObject.idProducto)} className="eliminar">
                                        <i className="bi bi-trash3" /> Eliminar
                                    </button>
                                </div>
                            )}

                            {/* Si el usuario no está logueado, mostrar un enlace para iniciar sesión */}
                            {!cookies.user && (
                                <p><NavLink to="/login" className='link'>Inicia sesión </NavLink> para comprar este producto</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de reseñas */}
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
                    <div className={'text-center'}>
                        <NavLink to={`/resenias/ver/${jsonDataObject.idProducto}`} className={'btn btn-outline-light mt-auto'}>
                            Ver más
                        </NavLink>
                    </div>
                </div>
            </section>
        </>
    );
}

