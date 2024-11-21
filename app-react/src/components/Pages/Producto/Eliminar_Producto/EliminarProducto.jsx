import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Success, Error } from '../../../Swal/Swal';

function EliminarProducto() {
    const navigate = useNavigate();
    const [cookies] = useCookies(['user']);
    const { idProducto } = useParams();
    const idUsuario = cookies.user.idUsuario;

    useEffect(() => {
        eliminarProducto();
    }, []);

    const eliminarProducto = async () => {
        const formdata = new FormData();
        formdata.append('idProducto', idProducto);
        formdata.append('idUsuario', idUsuario);
        formdata.append('cantidad', -1); // Cambiar a -1 para desactivar
    
        try {
            const response = await fetch(`http://localhost:5000/producto/update`, {
                method: 'POST',
                body: formdata
            }).then((response) => response.json()).then((data) => {
                console.log(data);
    
                if (data.error) {
                    switch (data.error) {
                        case "No se pudo actualizar el producto":
                            Error('No se pudo eliminar el producto');
                            break;
                        case "No autorizado para actualizar producto":
                            Error('No tienes autorización para eliminar dicho producto');
                            break;
                        case "No hay productos":
                            Error('No existe producto con dicho id');
                            break;
                        default:
                            Error('Ocurrió un error inesperado');
                            break;
                    }
                } else {
                    Success('Publicación eliminada correctamente');
                    navigate('/home');
                }
            });
        } catch (error) {
            console.log('Error en la petición', error);
            Error('Ocurrió un error inesperado, inténtalo más tarde');
        }
    };
    

    return (
        <div className="text-center">
          <div className="fullscreen-shape"></div>

            <h1 className='text-white'>Eliminando Producto</h1>
        </div>
    );
}

export default EliminarProducto;
