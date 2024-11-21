import { NavLink, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';
import './Carrito.css'
import { Success, Error } from '../../Swal/Swal';

// Función para agregar un producto al carrito
export async function agregarAlCarrito(idProducto, idCarrito, cantidad){
    console.log(idProducto, idCarrito);
    const formdata = new FormData();
    formdata.append("idProducto", idProducto);
    formdata.append("idCarrito", idCarrito);
    formdata.append("cantidad", cantidad)
    
    try{
        const res = await fetch('http://localhost:5000/carrito/agregar',{
            method: 'POST',
            body: formdata
        }).then((response) => response.json()).then((data) => {
            console.log(data);
            // Muestra un mensaje de éxito o error según la respuesta del servidor
            if(data['idCarrito']){
                Success('Producto agregado al carrito')
            }else{
                Error('No se pudo agregar el producto al carrito');
            }
            return data;
        })
    }catch(error){
        console.log(error)
        return error;
    }
}

// Función para cambiar la cantidad de un producto en el carrito
export function cambiarCantidad(idProducto, idCarrito, cantidad){
    const formdata = new FormData();
    formdata.append('idCarrito', idCarrito)
    formdata.append('idProducto', idProducto);
    formdata.append('cantidad', cantidad);
    try{
        const res = fetch('http://localhost:5000/carrito/editarCantidad',{
            method: 'POST',
            body: formdata
        }).then((response) => response.json()).then((data) => {
            console.log(data);
        })
    }catch(error){
        console.log(error)
        return error;
    }
}

export default function Carrito() {

    const navigate = useNavigate();  // Hook para la navegación
    const [products, setProducts] = useState([]);  // Estado para los productos en el carrito
    const [cookies, setCookie, removeCookie] = useCookies(['userToken']);  // Manejo de cookies (usuario autenticado)
    
    // Se ejecuta cuando el componente se monta para obtener los productos del carrito
    useEffect(() => {
        axios.get(`http://localhost:5000/carrito/productosInfo/${cookies.user['idCarrito']}`)
          .then(response => {
            // Construir la URL completa de la imagen para cada producto
            var updatedProducts = response.data.map(product => {
              return {
                ...product,
                fotourl: `http://localhost:5000/imagenes/${product.foto}` // Construir la URL completa aquí
              };
            });
            // Filtrar productos sin existencias
            quitarSinExistencias(updatedProducts);
          })
          .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Función para filtrar productos sin existencias
    const quitarSinExistencias = (productos) => {
        let productosFiltrados = productos.filter(producto => producto.cantidad > 0);
        setProducts(productosFiltrados);  // Actualiza el estado de los productos
    }
    
    // Función para eliminar un producto del carrito
    const eliminarProducto = (idProducto) => {
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
            title: "¿Estás seguro de eliminar este producto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí!",
            cancelButtonText: "No!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                const formdata = new FormData();
                formdata.append('idCarrito', cookies.user['idCarrito']);
                formdata.append('idProducto', idProducto);
                try{
                    fetch('http://localhost:5000/carrito/eliminarProducto',{
                        method: 'POST',
                        body: formdata
                    }).then((response) => response.json()).then((data) => {
                        console.log(data);
                        // Si la eliminación es exitosa, actualizar el estado y mostrar mensaje
                        if(data['success']){
                            const updatedProducts = products.filter(product => product.idProducto !== idProducto);
                            setProducts(updatedProducts);  // Elimina el producto de la lista
                            Success('Producto eliminado del carrito')
                        }else{
                            Error('No se pudo eliminar del carrito');
                        }
                    })
                }catch(error){
                    console.log(error)
                    return error;
                }
            } 
        });
    }

    // Función para navegar a la página de detalle de un producto
    const irADetalle = (product) => {
        return () => {
            // Si la cantidad del producto en el carrito es mayor que la cantidad disponible, ajustar
            if(product.cantidad_carrito > product.cantidad){
                product.cantidad_carrito = product.cantidad;
            }
            const jsonStr = JSON.stringify(product);  // Convierte el producto a JSON
            navigate(`/detalle/${encodeURIComponent(jsonStr)}/true`);  // Navega a la página de detalle
        }
    }

    // Función para modificar la cantidad de un producto en el carrito
    const modificaCantidad = (idProducto, cantidad) => {
        const formdata = new FormData();
        formdata.append('idCarrito', cookies.user['idCarrito']);
        formdata.append('idProducto', idProducto);
        formdata.append('cantidad', cantidad);
        try{
            const res = fetch('http://localhost:5000/carrito/editarCantidad',{
                method: 'POST',
                body: formdata
            }).then((response) => response.json()).then((data) => {
                console.log(data);
            })
        }catch(error){
            console.log(error)
            return error;
        }
    }

    // Función para navegar hacia atrás en el historial
    const goBack = () => {
        navigate(-1)
    }

    // Función para realizar la compra
    const comprar = () => {
        var idComp = 0;
        const formdata = new FormData();
        console.log(cookies.user);
        formdata.append('idUsuario', cookies.user['idComprador']);
        formdata.append('total', products.reduce((total, product) => total + product.precio * product.cantidad_carrito, 0));
        formdata.append('fecha', new Date().toISOString().slice(0, 10));

        try{
            const r = fetch('http://localhost:5000/compra/agregar', {
                method: 'POST',
                body: formdata
            }).then((response) => response.json()).then((data) => {
                console.log(data);
                // Si la compra es exitosa, enviar la compra y notificar
                if(data['idCompra']){
                    const id = data['idCompra']
                    const promises = products.map(product => {
                        const formdata = new FormData();
                        formdata.append('idCompra', id);
                        formdata.append('idProducto', product.idProducto);
                        formdata.append('cantidad', product.cantidad_carrito);
                        formdata.append('importe', product.precio * product.cantidad_carrito);
                        fetch('http://localhost:5000/contener/agregar', {
                            method: 'POST',
                            body: formdata
                        }).then((response) => response.json()).then((data) => {
                            console.log(data);
                        })
                    });
                    if(products.length > 0){
                        enviarCompra(id, products);  // Enviar detalles de la compra por correo
                        notificarCompra(id, products);  // Notificar la compra
                    }
                    Success('Compra realizada correctamente');

                    Promise.all(promises).then(() => {
                        fetch(`http://localhost:5000/carrito/limpiar/${cookies.user['idCarrito']}`).then(
                        (response) => response.json()
                        ).then((data) => {
                            console.log(data);
                            if(data['error']){
                                console.log('No se pudo limpiar el carrito');
                            }else{
                                setProducts([]);  // Limpiar el carrito en la UI
                            }
                        })
                    });
                }else{
                    Error('No se pudo realizar la compra');
                }
            })

        }catch(error){
            console.log('Error en la petición');
            console.log(error);
            Error('Ocurrió un error inesperado, inténtalo más tarde');
        }
    }

    // Función para enviar la compra por correo
    const enviarCompra = (idCompra, products) => {
        const payload = {
            correo: cookies.user['correo'],
            nombre: cookies.user['nombre'],
            idCompra: idCompra,
            products: products.map(product => ({
                idProducto: product.idProducto,
                nombre: product.nombre,
                cantidad: product.cantidad_carrito,
                importe: product.precio * product.cantidad_carrito
            }))
        };

        const jsonPayload = JSON.stringify(payload);

        try {
            fetch('http://localhost:5000/correos/compra', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonPayload
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
        } catch (error) {
            console.log(error);
        }
    }

    // Función para notificar a la tienda sobre la compra
    const notificarCompra = (idCompra, products) => {
        const payload = {
            idCompra: idCompra,
            products: products.map(product => ({
                idProducto: product.idProducto,
                cantidad: product.cantidad_carrito
            }))
        };
        const jsonPayload = JSON.stringify(payload);

        try {
            fetch('http://localhost:5000/correos/notificarCompra', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonPayload
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {/* UI del carrito */}
            <h1>Carrito</h1>
            {products.length === 0 ? (
                <p>No hay productos en tu carrito</p>
            ) : (
                <div>
                    {products.map(product => (
                        <div key={product.idProducto}>
                            <h5>{product.nombreProducto}</h5>
                            <p>$ {product.precio}</p>
                            <p>Cantidad: {product.cantidad_carrito}</p>
                            <button onClick={() => eliminarProducto(product.idProducto)}>Eliminar</button>
                        </div>
                    ))}
                    <button onClick={comprar}>Comprar</button>
                </div>
            )}
        </div>
    );
}

