import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { Success, Error } from '../../../Swal/Swal'; // Importación de alertas personalizadas

function ActualizarProducto() {
    const navigate = useNavigate();
    const [cookies] = useCookies(['user']);
    const { idProducto } = useParams();

    // Estados para manejar los datos del producto
    const [nombreProducto, setNombreProducto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagenes, setImagenes] = useState([]);
    const [imagen, setImagen] = useState([]);
    const [imagenCambiada, setImagenCambiada] = useState(false);
    const [precio, setPrecio] = useState('');
    const [contacto, setContacto] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const idUsuario = cookies.user.idUsuario;

    // Efecto para verificar si el producto ya ha sido comprado
    useEffect(() => {
        const verificarProducto = async () => {
            const formdata = new FormData();
            formdata.append('idProducto', idProducto);
            try {
                const response = await fetch(`http://localhost:5000/contener/revisar`, {
                    method: 'POST',
                    body: formdata,
                });
                const data = await response.json();
                setProductoNoComprado(!data); // Actualiza el estado basado en la respuesta
            } catch (error) {
                console.error('Error al verificar el producto:', error);
                Error('Ocurrió un error al verificar el producto');
            }
        };

        verificarProducto();
    }, [idProducto]);

    // Manejar cambios en las categorías seleccionadas
    const handleCategoriaChange = (e) => {
        const categoriaSeleccionada = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            setCategoriasSeleccionadas([...categoriasSeleccionadas, categoriaSeleccionada]);
        } else {
            const nuevasCategorias = categoriasSeleccionadas.filter(cat => cat !== categoriaSeleccionada);
            setCategoriasSeleccionadas(nuevasCategorias);
        }
    };

    // Registrar nuevas categorías
    const registrar_categorias = async (idProducto, categorias) => {
        categorias.forEach(async (categoria) => {
            const formdata = new FormData();
            formdata.append('idProducto', idProducto);
            formdata.append('categoria', categoria);

            try {
                const response = await fetch(`http://localhost:5000/categoria/create`, {
                    method: 'POST',
                    body: formdata,
                });
                const data = await response.json();
                if (data['error']) {
                    Error('No se pudo crear la categoría');
                }
            } catch (error) {
                console.error('Error al registrar categorías:', error);
            }
        });
    };

    // Actualizar categorías existentes
    const actualizar_categorias = async (categorias) => {
        const formdata = new FormData();
        formdata.append('idProducto', idProducto);

        try {
            const response = await fetch(`http://localhost:5000/categoria/delete`, {
                method: 'POST',
                body: formdata,
            });
            const data = await response.json();
            if (data['error']) {
                Error('No se pudieron borrar las categorías');
            } else {
                registrar_categorias(idProducto, categorias);
            }
        } catch (error) {
            console.error('Error al actualiza

