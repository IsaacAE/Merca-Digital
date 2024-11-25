import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Success, Error, Alert } from "../../Swal/Swal";
import { NavLink } from "react-router-dom";
import "../CSS/Form.css"

export default function RegistroP() {

    // Uso de cookies para manejar la autenticación del usuario
    const [cookies, setCookies] = useCookies(['userToken']);
    const navigate = useNavigate();

    // Manejo de estado para categorías seleccionadas e imágenes
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState(["otra"]);
    const [imagenes, setImagenes] = useState([]);

    // Actualiza las categorías seleccionadas al marcar/desmarcar checkboxes
    const handleCategoriaChange = (e) => {
        const categoriaSeleccionada = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            // Agrega la categoría seleccionada al array
            setCategoriasSeleccionadas([...categoriasSeleccionadas, categoriaSeleccionada]);
        } else {
            // Elimina la categoría desmarcada del array
            const nuevasCategorias = categoriasSeleccionadas.filter(cat => cat !== categoriaSeleccionada);
            setCategoriasSeleccionadas(nuevasCategorias);
        }
    };

    // Maneja el cambio de imágenes seleccionadas para subir
    const handleImagenChange = (e) => {
        const files = e.target.files;
        const arrayFiles = Array.from(files);
        setImagenes(arrayFiles);
    }

    // Función principal que se ejecuta al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación para asegurar que al menos una categoría esté seleccionada
        if (categoriasSeleccionadas.length === 0) {
            Alert('Se debe seleccionar al menos una categoría');
            return;
        }

        // Obtiene los valores de los campos del formulario
        const nombre = e.target.nombre.value;
        const descripcion = e.target.descripcion.value;
        const precio = e.target.precio.value;
        const stock = parseInt(e.target.stock.value); // Convierte el stock a entero
        const contacto = e.target.contacto.value;
        const idUsuario = cookies.user['idUsuario'];

        // Llama a la función para guardar las imágenes y registrar el producto
        const imagen = await guardar_imagenes(nombre, descripcion, precio, stock, categoriasSeleccionadas, contacto, idUsuario);
    }

    // Registra el producto junto con sus categorías
    const registrar = async (nombre, descripcion, precio, stock, categoria, contacto, idUsuario, imagen) => {
        console.log('Imagen: ', imagen);

        // Prepara los datos para enviar
        const formdata = new FormData();
        formdata.append('nombreProducto', nombre);
        formdata.append('descripcion', descripcion);
        formdata.append('precio', precio);
        formdata.append('cantidad', stock);
        formdata.append('contacto', contacto);
        formdata.append('idUsuario', idUsuario);
        formdata.append('imagen', imagen);

        // Envía los datos para registrar el producto
        registrar_producto(formdata, categoria);
    };

    // Envía los datos del producto al servidor
    const registrar_producto = async (formdata, categoria) => {
        try {
            const response = await fetch(`http://localhost:5000/producto/create`, {
                method: 'POST',
                body: formdata
            }).then((response) => response.json()).then((data) => {
                console.log(data);
                try {
                    if (data['error'] === "No se pudo crear el producto") {
                        Error('No se pudo crear el producto');
                    } else if (data['error'] === 'Faltan datos') {
                        Error('Faltan datos');
                    } else {
                        // Si el producto se crea correctamente, registra sus categorías
                        registrar_categorias(data['idProducto'], categoria);
                        Success('Producto creado correctamente');
                        navigate('/home');
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Registra las categorías asociadas al producto
    const registrar_categorias = async (idProducto, categorias) => {
        categorias.forEach(async (categoria) => {
            const formdata = new FormData();
            formdata.append('idProducto', idProducto);
            formdata.append('categoria', categoria);

            try {
                const response = await fetch(`http://localhost:5000/categoria/create`, {
                    method: 'POST',
                    body: formdata
                }).then((response) => response.json()).then((data) => {
                    console.log(data);
                    try {
                        if (data['error'] === "No se pudo crear la categoria") {
                            Error('No se pudo crear la categoria');
                        } else if (data['error'] === 'Faltan datos') {
                            Error('Faltan datos al crear la categoria');
                        } else {
                            console.log(data);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        });
    }

    // Sube las imágenes y devuelve la primera ruta generada
    const guardar_imagenes = async (nombre, descripcion, precio, stock, categoriasSeleccionadas, contacto, idUsuario) => {
        const formdata = new FormData();
        Array.from(imagenes).forEach((imagen, index) => {
            formdata.append(`imagen${index}`, imagen);
        });

        try {
            const response = await fetch(`http://localhost:5000/imagenes/guardar`, {
                method: 'POST',
                body: formdata
            }).then((response) => response.json()).then((data) => {
                console.log(data);
                const arr = data['rutas_imagenes'];
                registrar(nombre, descripcion, precio, stock, categoriasSeleccionadas, contacto, idUsuario, arr[0]);
                return arr[0];
            });
        } catch (error) {
            console.log('Error al subir las imagenes: ', error);
        }
    }

    // Navega a la página anterior
    const goBack = () => {
        navigate(-1);
    }

   return(
        <div className="container">
            <div className="fullscreen-shape"></div>
            <button type="button" className="btn-regresar" onClick={goBack}><i className="bi bi-arrow-left"/></button>
            <h1 className="text-white">Registro de Producto</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre" aria-describedby="nombreHelp" required/>
                    <div id="nombreHelp" className="form-text">Ingresa el nombre del producto</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea className="form-control" id="descripcion" aria-describedby="descripcionHelp" required></textarea>
                    <div id="descripcionHelp" className="form-text">Ingresa una descripción del producto</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input type="number" className="form-control" id="precio" min="0" aria-describedby="precioHelp" required/>
                    <div id="precioHelp" className="form-text">Ingresa el precio del producto</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="stock" className="form-label">Stock</label>
                    <input type="number" className="form-control" id="stock" aria-describedby="stockHelp" min="1" required/>
                    <div id="stockHelp" className="form-text">Ingresa la cantidad de productos en stock</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="categoria" className="form-label">Categoría</label>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="alimentos" id="categoriaAlimentos" onChange={handleCategoriaChange} />
                        <label className="form-check-label" htmlFor="categoriaAlimentos">Alimentos</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="electronica" id="categoriaElectronica" onChange={handleCategoriaChange} />
                        <label className="form-check-label" htmlFor="categoriaElectronica">Electrónica</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="ropa" id="categoriaRopa" onChange={handleCategoriaChange} />
                        <label className="form-check-label" htmlFor="categoriaRopa">Ropa</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="flores" id="categoriaFlores" onChange={handleCategoriaChange} />
                        <label className="form-check-label" htmlFor="categoriaFlores">Flores</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="accesorios" id="categoriaAccesorios" onChange={handleCategoriaChange} />
                        <label className="form-check-label" htmlFor="categoriaAccesorios">Accesorios</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="papeleria" id="categoriaPapeleria" onChange={handleCategoriaChange} />
                        <label className="form-check-label" htmlFor="categoriaPapeleria">Papeleria</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="regalos" id="categoriaRegalos" onChange={handleCategoriaChange} />
                        <label className="form-check-label" htmlFor="categoriaRegalos">Regalos</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="otra" id="categoriaOtra" onChange={handleCategoriaChange} defaultChecked/>
                        <label className="form-check-label" htmlFor="categoriaOtra">Otra</label>
                    </div>
    
                </div>
                <div className="mb-3">
                    <label htmlFor="contacto" className="form-label">Contacto</label>
                    <input type="text" className="form-control" id="contacto" aria-describedby="contactoHelp" required/>
                    <div id="contactoHelp" className="form-text">Ingresa el contacto del producto</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="imagen" className="form-label">Imagen</label>
                    <input type="file" className="form-control" id="imagen" aria-describedby="imagenHelp" onChange={handleImagenChange} multiple/>
                    <div id="imagenHelp" className="form-text">Selecciona una o varias imagenes del producto</div>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-azul mt-3 mb-4">Registrar</button>
                </div>
            </form>
        </div>
    )
}

