import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Success, Error } from '../../../Swal/Swal'; // Importación de funciones para mostrar mensajes de éxito y error

function EliminarProducto() {
    // Hook para la navegación programada
    const navigate = useNavigate();

    // Hook para acceder a las cookies
    const [cookies] = useCookies(['user']);

    // Hook para obtener el parámetro `idProducto` desde la URL
    const { idProducto } = useParams();

    // Obtener el `idUsuario` desde las cookies
    const idUsuario = cookies.user.idUsuario;

    // Hook `useEffect` que se ejecuta al montar el componente
    useEffect(() => {
        eliminarProducto(); // Llama a la función para eliminar el producto automáticamente
    }, []);

    // Función que realiza la solicitud para "eliminar" el producto
    const eliminarProducto = async () => {
        // Crear un objeto `FormData` con los datos requeridos
        const formdata = new FormData();
        formdata.append('idProducto', idProducto); // Agregar el ID del producto
        formdata.append('idUsuario', idUsuario); // Agregar el ID del usuario
        formdata.append('cantidad', -1); // Indicar que la cantidad es -1 para desactivar el producto
    
        try {
            // Realizar la solicitud a la API
            const response = await fetch(`http://localhost:5000/producto/update`, {
                method: 'POST', // Método HTTP POST
                body: formdata // Enviar el objeto `FormData` como cuerpo
            })
            .then((response) => response.json()) // Convertir la respuesta a JSON
            .then((data) => {
                console.log(data); // Mostrar los datos de la respuesta en la consola
    
                // Manejar errores basados en la respuesta
                if (data.error) {
                    switch (data.error) {
                        case "No se pudo actualizar el producto":
                            Error('No se pudo eliminar el producto'); // Mostrar mensaje de error
                            break;
                        case "No autorizado para actualizar producto":
                            Error('No tienes autorización para eliminar dicho producto'); // Usuario no autorizado
                            break;
                        case "No hay productos":
                            Error('No existe producto con dicho id'); // Producto inexistente
                            break;
                        default:
                            Error('Ocurrió un error inesperado'); // Error genérico
                            break;
                    }
                } else {
                    // Si no hay errores, mostrar mensaje de éxito
                    Success('Publicación eliminada correctamente');
                    navigate('/home'); // Redirigir al usuario a la página de inicio
                }
            });
        } catch (error) {
            console.log('Error en la petición', error); // Mostrar errores en la consola
            Error('Ocurrió un error inesperado, inténtalo más tarde'); // Mostrar mensaje de error genérico
        }
    };
    

    return (
        <div className="text-center">
            {/* Fondo visual */}
            <div className="fullscreen-shape"></div>

            {/* Mensaje de estado */}
            <h1 className='text-white'>Eliminando Producto</h1>
        </div>
    );
}

export default EliminarProducto;

