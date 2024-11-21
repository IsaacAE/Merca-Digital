import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Importa hooks de navegación y parámetros de la URL
import { NavLink } from "react-router-dom"; // Importa NavLink para enlaces de navegación
import { agregarAlCarrito } from "../Carrito/Carrito"; // Función para agregar productos al carrito
import axios from "axios"; // Cliente HTTP para realizar peticiones
import "./Galeria.css" // Estilos específicos para este componente
import { useCookies } from "react-cookie"; // Hook para gestionar cookies (por ejemplo, el carrito de un usuario)

export default function GaleriaVendedor() {

    const navigate = useNavigate(); // Hook de navegación para redirigir al usuario
    const { idVendedor } = useParams(); // Obtiene el ID del vendedor desde la URL

    const [cookies, setCookies] = useCookies(); // Obtiene y maneja cookies, como la información del usuario
    const [products, setProducts] = useState([]); // Estado para almacenar los productos del vendedor
    const [vendedor, setVendedor] = useState(null); // Estado para almacenar la información del vendedor

    const [loading, setLoading] = useState(true); // Estado para indicar si los datos se están cargando

    // useEffect que se ejecuta cuando el componente se monta
    useEffect(() => {
        // Función para obtener los productos del vendedor
        const fetchProducts = async () => {
          try {
            // URL para obtener productos específicos del vendedor
            let url = `http://localhost:5000/producto/readV/${idVendedor}`;
            // Realiza la petición GET para obtener los productos
            const response = await axios.get(url).then(res => {
                console.log(res.data);
                // Modifica los productos para incluir la URL de la imagen
                var updatedProducts = res.data.map(product => ({
                    ...product,
                    fotourl: `http://localhost:5000/imagenes/${product.foto}`
                }));
                // Llama a la función para filtrar los productos sin existencia
                quitarSinExistencias(updatedProducts);
            });
          } catch (error) {
            console.error('Error fetching data:', error); // Si hay un error en la petición
          }
        };

        // Función para obtener los detalles del vendedor
        const fetchVendedor = async () => {
            try {
                // URL para obtener la información del vendedor
                const response = await axios.get(`http://localhost:5000/usuario/read/${idVendedor}`).then(
                    res => {
                        console.log(res.data);
                        setVendedor(res.data); // Establece los detalles del vendedor en el estado
                        setLoading(false); // Cambia el estado de carga a false
                    })
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // En caso de error, también cambia el estado de carga a false
            }
        }

        fetchVendedor(); // Llama a la función para obtener los datos del vendedor
        fetchProducts(); // Llama a la función para obtener los productos
    }, []); // Este efecto solo se ejecuta una vez, al montar el componente

    // Función para filtrar los productos sin existencias
    const quitarSinExistencias = (productos) => {
        // Filtra los productos para mostrar solo aquellos con cantidad > 0
        let productosFiltrados = productos.filter(producto => producto.cantidad > 0);
        setProducts(productosFiltrados); // Actualiza el estado con los productos filtrados
    }

    // Función para redirigir a la página de detalle del producto
    const irADetalle = (product) => {
        return () => {
          const jsonStr = JSON.stringify(product); // Convierte el producto en un string JSON
          navigate(`/detalle/${encodeURIComponent(jsonStr)}/false`); // Navega a la página de detalle del producto
        }
    }

    // Función para agregar un producto al carrito
    const agregar = (idProducto) => {
        agregarAlCarrito(idProducto, cookies.user['idCarrito'], 1)
          .then(response => {
            console.log(response); // Si se agrega con éxito, muestra la respuesta
          })
          .catch(error => {
            console.error('Error adding to cart:', error); // Si ocurre un error, lo muestra en la consola
          });
    }

    // Función para regresar a la página anterior
    const goBack = () => {
        navigate(-1); // Navega hacia atrás
    }

    // Si el componente está cargando, muestra un mensaje de carga
    if(loading){
        return(
            <div>
                <div className="fullscreen-shape"></div>
                <h1>Cargando...</h1> {/* Mensaje de carga */}
            </div>
        )
    }

    return(
        <>
            <button type="button" className="btn-regresar" onClick={goBack}><i className="bi bi-arrow-left"/></button> {/* Botón para regresar */}
            <div className="fullscreen-shape"></div>
            <h1 className="text-white">Galería del vendedor</h1>
            <div className="info-vendedor">
                <img src={vendedor.imagen} className="imagen-gal m-4"/> {/* Imagen del vendedor */}
                <div className="info-text">
                    <p className="mt-4">{vendedor.nombre} {vendedor.apPat} {vendedor.apMat}</p> {/* Nombre del vendedor */}
                    <p>{vendedor.correo}</p> {/* Correo del vendedor */}
                </div>
            </div>
            <section className="py-5">
                <div className="container px-4 px-lg-5 mt-5">
                    <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-4 row-cols-xl-5 justify-content-center">
                        {products.length === 0 && (
                            <p className='text-center'>
                                {vendedor ? 'No tienes productos registrados' : 'No hay productos disponibles'}
                            </p> // Mensaje si no hay productos disponibles
                        )}
                        {products.map(product => (
                            <div key={product.idProducto} className={`product-item m-2 ${product.cantidad <= 0 ? 'card-borrosa ' : ''}`}>
                                <div className='imagen' onClick={irADetalle(product)}>
                                    <img src={product.fotourl} alt={product.descripcion} className="product-image"/>
                                </div>
                                <div className="product-info" onClick={irADetalle(product)}>
                                    <h3>{product.nombreProducto}</h3>
                                    <p>${product.precio}</p>
                                </div>
                                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                    {cookies.user && cookies.user['vendedor'] === 0 && (
                                        <div className="text-center">
                                            <button className="btn btn-outline-light mt-auto" onClick={() => agregar(product.idProducto)}>
                                                <i className="bi bi-cart4" /> Agregar al carrito
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

