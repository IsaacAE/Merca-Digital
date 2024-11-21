import React, { useState, useEffect, useCallback } from 'react'; // Importa los hooks necesarios de React
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP
import { NavLink, useNavigate } from 'react-router-dom'; // Importa los hooks de navegación
import { useCookies } from 'react-cookie'; // Hook para gestionar cookies
import { agregarAlCarrito } from '../Carrito/Carrito'; // Importa la función para agregar productos al carrito
import RangeSlider from '../Gadgets/RangeBar.jsx'; // Importa el componente del control deslizante (RangeSlider)
import './HomeUser.css'; // Importa los estilos del componente

export default function HomeUser() {
    const navigate = useNavigate(); // Hook para la navegación entre páginas
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']); // Hook para manejar cookies
    const [products, setProducts] = useState([]); // Estado para almacenar los productos
    const [category, setCategory] = useState(''); // Estado para almacenar la categoría seleccionada
    const [searchString, setSearchString] = useState(''); // Estado para almacenar el texto de búsqueda
    const [rangeValues, setRangeValues] = useState([0, 1000000]); // Estado para el rango de precios
    const [dataValues, setDataValues] = useState(['','','','']); // Estado para almacenar los valores de búsqueda

    // Función para actualizar el valor mínimo del rango de precios
    const handleMinChange = (e) => {
        const newValue = e.target.value;
        if (newValue === "") {
            setRangeValues([0, rangeValues[1]]); 
        } else {
            const newMin = parseFloat(newValue);
            setRangeValues([newMin, rangeValues[1]]);
        }
    };

    // Función para actualizar el valor máximo del rango de precios
    const handleMaxChange = (e) => {
        const newValue = e.target.value;
        if (newValue === "") {
            setRangeValues([rangeValues[0], 0]); 
        } else {
            const newMax = parseFloat(newValue);
            setRangeValues([rangeValues[0], newMax]);
        }
    };

    // useEffect que se ejecuta cuando cambian las categorías, la cadena de búsqueda o los valores del rango de precios
    useEffect(() => {
        setDataValues([searchString, category, rangeValues[0], rangeValues[1]]);
    }, [category, searchString, rangeValues]);

    // Función para obtener los productos con filtros aplicados
    const fetchProducts = useCallback(async () => {
        try {
            let url = 'http://localhost:5000/products';

            // Si los valores del rango son válidos, se crea la URL con los filtros
            if (rangeValues[0] >= 0 && rangeValues[1] >= 0) {
                url = `http://localhost:5000/producto/read/checks/${dataValues.join(',')}`;
            } else {
                setRangeValues([0, 1000000]);
                setDataValues([searchString, category, rangeValues[0], rangeValues[1]]);
                url = `http://localhost:5000/producto/read/checks/${dataValues.join(',')}`;
            }

            // Solicita los productos a la API
            const response = await axios.get(url);
            var updatedProducts = response.data.map(product => ({
                ...product,
                fotourl: `http://localhost:5000/imagenes/${product.foto}`
            }));

            // Filtra los productos según el rol del usuario
            if (cookies.user && cookies.user['vendedor'] === 1) {
                // Si el usuario es un vendedor, filtra los productos para que solo vea los que ha agregado
                let filteredProducts = updatedProducts.filter(product => product.idUsuario === cookies.user['idUsuario']);
                setProducts(filteredProducts);
                let productosFiltradosEliminados = filteredProducts.filter(producto => producto.cantidad >= 0);
                setProducts(productosFiltradosEliminados);
            } else {
                // Si el usuario no es vendedor, solo muestra los productos con cantidad mayor que cero
                let filteredProducts = updatedProducts.filter(product => product.cantidad > 0);
                setProducts(filteredProducts);
            }
          
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [dataValues, cookies]);

    // useEffect para obtener los productos cuando cambian los datos de búsqueda o filtros
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Función para agregar productos al carrito
    const agregar = (idProducto) => {
        agregarAlCarrito(idProducto, cookies.user['idCarrito'], 1)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
            });
    }

    // Función para redirigir al detalle de un producto
    const irADetalle = (product) => {
        return () => {
            const jsonStr = JSON.stringify(product);
            navigate(`/detalle/${encodeURIComponent(jsonStr)}/false`);
        }
    }

    // Filtra productos para mostrar solo los que pertenecen al vendedor
    const filtrar = (productos) => {
        let productosFiltrados = productos.filter(producto => producto.idUsuario === cookies.user['idUsuario']);
        setProducts(productosFiltrados);
        let productosFiltradosEliminados = productos.filter(producto => producto.cantidad >= 0);
        setProducts(productosFiltradosEliminados);
    }

    // Filtra productos que tienen cantidad mayor que cero
    const quitarSinExistencias = (productos) => {
        let productosFiltrados = productos.filter(producto => producto.cantidad > 0);
        setProducts(productosFiltrados);
    }

    // Función de búsqueda
    const handleSearch = () => {
        console.log("Cadena de búsqueda:", searchString);
    };

    return (
        <>
            <div className="fullscreen-shape"></div> {/* Fondo de pantalla */}
            <header className="bg-dark py-5 encabezado">
                <div className="container px-4 px-lg-5 my-5">
                    <div className="text-center text-white">
                        <h1 className="display-4 fw-bolder">Bienvenido a Prometienda {cookies.user['nombre']}</h1>
                        <p className="lead fw-normal text-white-70 mb-0">Tu tienda virtual de la Facultad de Ciencias</p>
                    </div>
                </div>
            </header>

            {/* Barra de búsqueda y filtros */}
            <div className="topnav">
                <div className="search-container buscar">
                    <input type="text" placeholder="Search.." name="search" value={searchString} onChange={(e) => setSearchString(e.target.value)} />
                </div>
                <div className="app-container precios">
                    <label className="text-white">Rango de precio:</label>
                    <div className="range-inputs">
                        <input
                            type="number"
                            min="0"
                            max="5000"
                            step="1"
                            value={rangeValues[0] === 0? '' : rangeValues[0]}
                            onChange={handleMinChange}
                            className="range-input"
                        />
                        <input
                            type="number"
                            min="0"
                            max="5000"
                            step="1"
                            value={rangeValues[1] === 0 ? '' : rangeValues[1]}
                            onChange={handleMaxChange}
                            className="range-input"
                        />
                    </div>
                    <p>Valores actuales: {rangeValues[0]} - {rangeValues[1]}</p>
                </div>
            </div>

            {/* Selector de categoría */}
            <div className="products-container">
                <label className='text-white'>Selecciona una categoría:</label>
                <select className="btn-azul" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="">Todo</option>
                    <option value="alimentos">Alimentos</option>
                    <option value="electronica">Electrónica</option>
                    <option value="ropa">Ropa</option>
                    <option value="flores">Flores</option>
                    <option value="accesorios">Accesorios</option>
                    <option value="papeleria">Papelería</option>
                    <option value="regalos">Regalos</option>
                    <option value="otra">Otra</option>
                </select>
            </div>

            {/* Sección de productos */}
            <section className="py-5">
                <div className="container px-4 px-lg-5 mt-5">
                    <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                        {products.slice(0, 8).map(product => (
                            <div className={`col mb-5`} key={product.idProducto}>
                                <div className={`card h-100 tarjeta ${product.cantidad <= 0 ? 'card-borrosa' : ''}`}>
                                    <div className='cont-img text-center' onClick={irADetalle(product)}>
                                        <img className="card-img-top img-fluid img-card mt-1" src={product.fotourl} alt={product.nombreProducto} />
                                    </div>
                                    <div className="card-body p-4" onClick={irADetalle(product)}>
                                        <div className="text-center">
                                            <h5 className="fw-bolder">{product.nombreProducto}</h5>
                                            <p>$ {product.precio}</p>
                                        </div>
                                    </div>
                                    <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                        {cookies.user['vendedor'] === 0 && (
                                            <div className="text-center">
                                                <button className="btn btn-outline-light mt-auto" onClick={() => agregar(product.idProducto)}>
                                                    <i className="bi bi-cart4" /> Agregar al carrito
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Botones para ver más productos o gestionar productos si es vendedor */}
            <div className='text-center mb-5'>
                {cookies.user['vendedor'] === 0 && (
                    <NavLink to='/productos/ver' className={'btn btn-azul'} >Ver más productos</NavLink>
                )}
                {cookies.user['vendedor'] === 1 && (
                    <>
                        <NavLink to='/productos/ver' className={'btn btn-azul'}>Ver todos mis productos en venta</NavLink>
                        <NavLink to='/productos/registrar' className={'btn btn-azul'}>Registrar producto</NavLink>
                    </>
                )}
            </div>
        </>
    );
}

