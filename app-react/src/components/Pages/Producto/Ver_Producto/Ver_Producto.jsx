import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { agregarAlCarrito } from '../../Carrito/Carrito';
import './Ver_Producto.css';
import ButtonGroup from './MultiButton.jsx';

function VerProducto() {
  // Estado para gestionar la lista de productos
  const [products, setProducts] = useState([]);

  // Estado para la categoría seleccionada
  const [category, setCategory] = useState('');

  // Estado para el texto de búsqueda
  const [searchString, setSearchString] = useState('');

  // Estado para gestionar cookies
  const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

  // Estado para gestionar el rango de precios
  const [rangeValues, setRangeValues] = useState([0, 100000]);

  // Estado para valores combinados usados en el filtro
  const [dataValues, setDataValues] = useState(['', '', '', '']);

  // Determinar si el usuario es vendedor
  const vendedor = cookies.user && cookies.user['vendedor'] === 1;

  // Navegación programada
  const navigate = useNavigate();

  // Actualizar el valor mínimo del rango de precios
  const handleMinChange = (e) => {
    const newValue = e.target.value;
    if (newValue === "") {
      setRangeValues([0, rangeValues[1]]); // Si el valor está vacío, restaura a 0
    } else {
      setRangeValues([parseFloat(newValue), rangeValues[1]]);
    }
  };

  // Actualizar el valor máximo del rango de precios
  const handleMaxChange = (e) => {
    const newValue = e.target.value;
    if (newValue === "") {
      setRangeValues([rangeValues[0], 0]); // Si el valor está vacío, restaura a 0
    } else {
      setRangeValues([rangeValues[0], parseFloat(newValue)]);
    }
  };

  // Actualizar valores combinados cuando cambian los filtros
  useEffect(() => {
    setDataValues([searchString, category, rangeValues[0], rangeValues[1]]);
  }, [category, searchString, rangeValues]);

  // Función para obtener productos desde la API
  const fetchProducts = useCallback(async () => {
    try {
      let url = 'http://localhost:5000/products';

      // Verificar si hay valores válidos en el rango y ajustar la URL de la API
      if (rangeValues[0] >= 0 && rangeValues[1] >= 0) {
        url = `http://localhost:5000/producto/read/checks/${dataValues.join(',')}`;
      } else {
        // Restaurar rango predeterminado si no es válido
        setRangeValues([0, 1000000]);
        setDataValues([searchString, category, rangeValues[0], rangeValues[1]]);
        url = `http://localhost:5000/producto/read/checks/${dataValues.join(',')}`;
      }

      // Llamada a la API
      const response = await axios.get(url);

      // Actualizar productos con URL de imágenes
      const updatedProducts = response.data.map(product => ({
        ...product,
        fotourl: `http://localhost:5000/imagenes/${product.foto}`,
      }));

      if (vendedor) {
        // Si el usuario es vendedor, filtrar por productos propios y sin existencias negativas
        const filteredProducts = updatedProducts.filter(product => product.idUsuario === cookies.user['idUsuario']);
        setProducts(filteredProducts.filter(product => product.cantidad >= 0));
      } else {
        // Si no es vendedor, mostrar solo productos con existencias
        setProducts(updatedProducts.filter(product => product.cantidad > 0));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [dataValues, cookies]);

  // Llamar a `fetchProducts` al cargar y cuando cambien los filtros
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Función para agregar un producto al carrito
  const agregar = (idProducto) => {
    agregarAlCarrito(idProducto, cookies.user['idCarrito'], 1)
      .then(response => console.log(response))
      .catch(error => console.error('Error adding to cart:', error));
  };

  // Navegar a la página de detalles del producto
  const irADetalle = (product) => {
    return () => {
      const jsonStr = JSON.stringify(product);
      navigate(`/detalle/${encodeURIComponent(jsonStr)}/false`);
    };
  };

  // Navegar a la página anterior
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      {/* Fondo visual */}
      <div className="fullscreen-shape"></div>
      
      {/* Botón para regresar */}
      <button type="button" className="btn-regresar" onClick={goBack}>
        <i className="bi bi-arrow-left" />
      </button>
      
      {/* Título */}
      <h1 className='text-white'>Productos</h1>
      
      {/* Controles de búsqueda y rango */}
      <div className="topnav">
        <div className="search-container buscar">
          <input
            type="text"
            placeholder="Search.."
            name="search"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
        
        <div className="app-container precios">
          <label className="text-white">Rango de precio:</label>
          <div className="range-inputs">
            <input
              type="number"
              min="0"
              max="5000"
              step="1"
              value={rangeValues[0] === 0 ? '' : rangeValues[0]}
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
      
      {/* Lista de productos */}
      <section className="py-5">
        <div className="container px-4 px-lg-5 mt-5">
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-4 row-cols-xl-5 justify-content-center">
            {products.length === 0 && (
              <p className='text-center'>
                {vendedor ? 'No tienes productos registrados' : 'No hay productos disponibles'}
              </p>
            )}
            {products.map(product => (
              <div key={product.idProducto} className={`product-item m-2 ${product.cantidad <= 0 ? 'card-borrosa' : ''}`}>
                <div className='imagen' onClick={irADetalle(product)}>
                  <img src={product.fotourl} alt={product.descripcion} className="product-image" />
                </div>
                <div className="product-info" onClick={irADetalle(product)}>
                  <h3>{product.nombreProducto}</h3>
                  <p>${product.precio}</p>
                </div>
                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                  {cookies.user && !vendedor && (
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
    </div>
  );
}

export default VerProducto;

