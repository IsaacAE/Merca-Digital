import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { agregarAlCarrito } from '../Carrito/Carrito';
import RangeSlider from '../Gadgets/RangeBar.jsx';
import './HomeUser.css';

export default function HomeUser() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('');
    const [searchString, setSearchString] = useState('');
    const [rangeValues, setRangeValues] = useState([0, 1000000]);
    const [dataValues, setDataValues] = useState(['','','',''])

    const handleMinChange = (e) => {
        const newValue = e.target.value;
        if (newValue === "") {
            setRangeValues([0, rangeValues[1]]); 
        } else {
            const newMin = parseFloat(newValue);
            setRangeValues([newMin, rangeValues[1]]);
        }
    };

    const handleMaxChange = (e) => {
        const newValue = e.target.value;
        if (newValue === "") {
            setRangeValues([rangeValues[0], 0]); 
        } else {
            const newMax = parseFloat(newValue);
            setRangeValues([rangeValues[0], newMax]);
        }
    };

    useEffect(() => {
        setDataValues([searchString, category, rangeValues[0], rangeValues[1]]);
    }, [category, searchString, rangeValues]);

    const fetchProducts = useCallback(async () => {
        try {
            let url = 'http://localhost:5000/products';

            if (rangeValues[0] >= 0 && rangeValues[1] >= 0) {
                url = `http://localhost:5000/producto/read/checks/${dataValues.join(',')}`;
            } else {
                setRangeValues([0, 1000000]);
                setDataValues([searchString, category, rangeValues[0], rangeValues[1]]);
                url = `http://localhost:5000/producto/read/checks/${dataValues.join(',')}`;
            }

            const response = await axios.get(url);
            var updatedProducts = response.data.map(product => ({
                ...product,
                fotourl: `http://localhost:5000/imagenes/${product.foto}`
            }));
           

            if (cookies.user && cookies.user['vendedor'] === 1) {
                // Si el usuario es vendedor, filtra los productos para que solo muestre los que ha agregado
               let filteredProducts = updatedProducts.filter(product => product.idUsuario === cookies.user['idUsuario']);
               setProducts(filteredProducts);
               let productosFiltradosEliminados = filteredProducts.filter(producto => producto.cantidad >= 0);
               setProducts(productosFiltradosEliminados);
            } else {
                // Si el usuario no es vendedor, filtra los productos para que solo muestre los que tienen una cantidad mayor a cero
               let filteredProducts = updatedProducts.filter(product => product.cantidad > 0);
               setProducts(filteredProducts);
            }

          
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [dataValues, cookies]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const agregar = (idProducto) => {
        agregarAlCarrito(idProducto, cookies.user['idCarrito'], 1)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
            });
    }

    const irADetalle = (product) => {
        return () => {
            const jsonStr = JSON.stringify(product);
            navigate(`/detalle/${encodeURIComponent(jsonStr)}/false`);
        }
    }

    const filtrar = (productos) => {
        let productosFiltrados = productos.filter(producto => producto.idUsuario === cookies.user['idUsuario'])
        setProducts(productosFiltrados)
        let productosFiltradosEliminados = productos.filter(producto => producto.cantidad >= 0);
        setProducts(productosFiltradosEliminados);
    }

    const quitarSinExistencias = (productos) => {
        let productosFiltrados = productos.filter(producto => producto.cantidad > 0);
        setProducts(productosFiltrados);
    }

    const handleSearch = () => {
        console.log("Cadena de búsqueda:", searchString);
    };

    return (
        <>
            <div className="fullscreen-shape"></div>
            <header className="bg-dark py-5 encabezado">
                <div className="container px-4 px-lg-5 my-5">
                    <div className="text-center text-white">
                        <h1 className="display-4 fw-bolder">Bienvenido a Prometienda {cookies.user['nombre']}</h1>
                        <p className="lead fw-normal text-white-70 mb-0">Tu tienda virtual de la Facultad de Ciencias</p>
                    </div>
                </div>
            </header>
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
    )
}
