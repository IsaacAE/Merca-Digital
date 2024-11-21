import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { agregarAlCarrito } from "../Carrito/Carrito";
import axios from "axios";
import "./Galeria.css"
import { useCookies } from "react-cookie";

export default function GaleriaVendedor(){

    const navigate = useNavigate()

    const {idVendedor} = useParams();

    const [cookies, setCookies] = useCookies()
    const [products, setProducts] = useState([])
    const [vendedor, setVendedor] = useState(null)

    const [loading, setLoading] = useState(true); // Estado de carga


    useEffect(() => {
        const fetchProducts = async () => {
          try {
            let url = `http://localhost:5000/producto/readV/${idVendedor}`;

            const response = await axios.get(url).then(
                res => {
                    console.log(res.data)
                    var updatedProducts = res.data.map(product => ({
                        ...product,
                        fotourl: `http://localhost:5000/imagenes/${product.foto}`
                    }));
                    quitarSinExistencias(updatedProducts)
                }
            )
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        const fetchVendedor = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/usuario/read/${idVendedor}`).then(
                    res => {
                        console.log(res.data)
                        setVendedor(res.data)
                        setLoading(false)
                    })
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false)
            }
        }
        fetchVendedor()
        fetchProducts();
    }, []);


    const quitarSinExistencias = (productos) => {
        let productosFiltrados = productos.filter(producto => producto.cantidad > 0)
        setProducts(productosFiltrados)
    }

    const irADetalle = (product) => {
        return () => {
          const jsonStr = JSON.stringify(product)
          navigate(`/detalle/${encodeURIComponent(jsonStr)}/false`);
        }
    }

    const agregar = (idProducto) => {
        agregarAlCarrito(idProducto, cookies.user['idCarrito'], 1)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.error('Error adding to cart:', error);
          });
    }

    const goBack = () => {
        navigate(-1)
    }

    if(loading){
        return(
            <div>
                <div className="fullscreen-shape"></div>
                <h1>Cargando...</h1>
            </div>
        )
    }

    return(
        <>
    
            <button type="button" className="btn-regresar" onClick={goBack}><i className="bi bi-arrow-left"/></button>

            <div className="fullscreen-shape"></div>
            <h1 className="text-white">Galería del vendedor</h1>
            <div className="info-vendedor">
                <img src={vendedor.imagen} className="imagen-gal m-4"/>
                <div className="info-text">
                    <p className="mt-4">{vendedor.nombre} {vendedor.apPat} {vendedor.apMat}</p>
                    <p>{vendedor.correo}</p>
                </div>
            </div>
            <section className="py-5">
                <div className="container px-4 px-lg-5 mt-5">
                    <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-4 row-cols-xl-5 justify-content-center">
                    {products.length === 0 && (
                    <p className='text-center'>
                        {vendedor ? 'No tienes productos registrados' : 'No hay productos disponibles'}
                    </p>
                    )}
                    {products.map(product => (
                    <div key={product.idProducto} className={`product-item m-2 ${product.cantidad<=0 ? 'card-borrosa ' : ''}`}>
                        <div className='imagen' onClick={irADetalle(product)}>
                        <img src={product.fotourl} alt={product.descripcion} className="product-image"/>
                        </div>
                        <div className="product-info" onClick={irADetalle(product)}>
                        <h3>{product.nombreProducto}</h3>
                        <p>${product.precio}</p>
                        </div>
                        <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        {cookies.user && cookies.user['vendedor']===0 && (
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