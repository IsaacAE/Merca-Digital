import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from 'axios';
import "./Compras.css";
import { Navigate, useNavigate } from "react-router-dom";

export default function Compras() {
    const [compras, setCompras] = useState([]);  // Estado para almacenar las compras
    const [cookies, setCookies] = useCookies(['userToken']);  // Obtener el token de usuario desde las cookies
    const navigation = useNavigate();  // Hook de navegación

    // useEffect que se ejecuta al cargar el componente o cuando cambia el usuario
    useEffect(() => {
        const fetchCompras = async () => {
            try {
                // Hacer una solicitud GET para obtener las compras del usuario
                const response = await axios.get(`http://localhost:5000/compra/getConProductos/${cookies.user['idComprador']}`);
                console.log(response.data);
                if (response.data.error) {
                    console.log("No se pudo hacer update");
                } else {
                    // Actualizar los productos de cada compra con la URL completa de las imágenes
                    const updated = response.data.map(
                        compra => ({
                            ...compra,
                            productos: compra.productos.map(
                                producto => ({
                                    ...producto,
                                    fotourl: `http://localhost:5000/imagenes/${producto.foto}`  // Agregar URL completa de la imagen
                                })
                            )
                        })
                    );
                    setCompras(updated);  // Actualizar el estado de las compras
                }
            } catch (error) {
                console.error('Error fetching data:', error);  // Manejar errores de la solicitud
            }
        };
        fetchCompras();  // Llamar a la función para obtener las compras al cargar el componente
    }, [cookies.user]);  // Dependencia: se vuelve a ejecutar cuando cambia el usuario

    // Función para navegar hacia atrás en el historial
    function goBack() {
        navigation(-1);  // Regresa una página atrás
    }

    // Función para navegar a la página de reseñas de un producto
    function dejar_comen_calif(idCompra, idProducto) {
        navigation(`/resenia/${idCompra}/${idProducto}`);  // Navega a la página de reseña con los IDs de la compra y el producto
    }

    return (
        <>
            {/* Fondo de pantalla */}
            <div className="fullscreen-shape"></div>

            {/* Botón para regresar a la página anterior */}
            <button type="button" className="btn-regresar" onClick={goBack}>
                <i className="bi bi-arrow-left" />
            </button>

            {/* Título de la página */}
            <h1 className="text-white">Mis compras</h1>
            
            {/* Mensaje informativo */}
            <div className="text-center">
                <h3 className="text-gray">¡No olvides dar click a los productos para reseñarlos!</h3>
            </div>

            {/* Tabla de compras */}
            <div className="container">
                <div className="row">
                    <table className="tabla">
                        <thead>
                            <tr>
                                <th className="th1">Fecha</th>
                                <th className="th1">Productos</th>
                                <th className="th1">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mapear cada compra para mostrarla en una fila de la tabla */}
                            {compras.map(
                                compra => (
                                    <tr className="tr1" key={compra.idCompra}>
                                        <td className="td1">{compra.fecha.substring(0, 16)}</td>  {/* Muestra la fecha de la compra */}
                                        <td className="td1">
                                            {/* Muestra los productos de la compra */}
                                            <table className="tabla2">
                                                <tbody>
                                                    {compra.productos.map(
                                                        producto => (
                                                            <tr key={producto.idProducto} onClick={() => dejar_comen_calif(compra.idCompra, producto.idProducto)}>
                                                                <td>
                                                                    {/* Imagen del producto */}
                                                                    <img src={`http://localhost:5000/imagenes/${producto.foto}`} alt={producto.nombre} className="img-compras" />
                                                                </td>
                                                                <td>
                                                                    {/* Nombre del producto */}
                                                                    <span className="ms-2">{producto.nombreProducto}</span>
                                                                </td>
                                                                <td>
                                                                    {/* Cantidad del producto */}
                                                                    <span className="ms-2">Cantidad: {producto.cantidad}</span>
                                                                </td>
                                                                <td>
                                                                    {/* Importe del producto */}
                                                                    <span>Importe: $ {producto.importe}</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </td>
                                        <td className="td1">$ {compra.total}</td>  {/* Total de la compra */}
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

