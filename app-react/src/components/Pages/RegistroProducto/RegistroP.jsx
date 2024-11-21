import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Success, Error, Alert } from "../../Swal/Swal";
import { NavLink } from "react-router-dom";
import "../CSS/Form.css"

export default function RegistroP(){

    const [cookies, setCookies] = useCookies(['userToken']);
    const navigate = useNavigate();

    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState(["otra"]);
    const [imagenes, setImagenes] = useState([]);

    const handleCategoriaChange = (e) => {
        const categoriaSeleccionada = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            // Si la categoría está marcada, la agregamos al array de categorías seleccionadas
            setCategoriasSeleccionadas([...categoriasSeleccionadas, categoriaSeleccionada]);
        } else {
            // Si la categoría está desmarcada, la eliminamos del array de categorías seleccionadas
            const nuevasCategorias = categoriasSeleccionadas.filter(cat => cat !== categoriaSeleccionada);
            setCategoriasSeleccionadas(nuevasCategorias);
        }
    };

    const handleImagenChange = (e) => {
        const files = e.target.files;
        const arrayFiles = Array.from(files);
        setImagenes(arrayFiles);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(categoriasSeleccionadas.length === 0){
            Alert('Se debe seleccionar al menos una categoría');
            return;
        }

        const nombre = e.target.nombre.value;
        const descripcion = e.target.descripcion.value;
        const precio = e.target.precio.value;
        const stock = parseInt(e.target.stock.value); // Asegurarse de que el stock sea un número entero
        const contacto = e.target.contacto.value;
        const idUsuario = cookies.user['idUsuario'];
        
         

        const imagen = await guardar_imagenes(nombre, descripcion, precio, stock, categoriasSeleccionadas, contacto, idUsuario);
    }

    const registrar = async(nombre, descripcion, precio, stock, categoria, contacto, idUsuario, imagen) => {
        console.log('Imagen: ', imagen);
        const formdata = new FormData();
        formdata.append('nombreProducto', nombre);
        formdata.append('descripcion', descripcion);
        formdata.append('precio', precio);
        formdata.append('cantidad', stock);
        formdata.append('contacto', contacto);
        formdata.append('idUsuario', idUsuario);
        formdata.append('imagen', imagen);

        registrar_producto(formdata, categoria);
    };

    const registrar_producto = async(formdata, categoria) => {
        try{
            const response = await fetch(`http://localhost:5000/producto/create`, {
                method: 'POST',
                body: formdata
            }).then((response) => response.json()).then((data) => {
                console.log(data);
                try{
                    if(data['error'] === "No se pudo crear el producto"){
                        Error('No se pudo crear el producto');
                    }else if(data['error'] === 'Faltan datos'){
                        Error('Faltan datos');
                    }else{
                        registrar_categorias(data['idProducto'], categoria);
                        Success('Producto creado correctamente');
                        console.log(data);
                        navigate('/home')
                    }
                }catch(error){
                    console.log(error);
                }
            });
        } catch(error){
            console.log(error);
        }
    }

    const registrar_categorias = async(idProducto, categorias) => {
        categorias.forEach(async (categoria) => {
            const formdata = new FormData();
            formdata.append('idProducto', idProducto);
            formdata.append('categoria', categoria);

            try{
                const response = await fetch(`http://localhost:5000/categoria/create`, {
                    method: 'POST',
                    body: formdata
                }).then((response) => response.json()).then((data) => {
                    console.log(data);
                    try{
                        if(data['error'] === "No se pudo crear la categoria"){
                            Error('No se pudo crear la categoria');
                        }else if(data['error'] === 'Faltan datos'){
                            Error('Faltan datos al crear la categoria');
                        }else{
                            console.log(data);
                        }
                    }catch(error){
                        console.log(error);
                    }
                });
            } catch(error){
                console.log(error);
            }
        });
    }

    const guardar_imagenes = async(nombre, descripcion, precio, stock, categoriasSeleccionadas, contacto, idUsuario) => {
        const formdata = new FormData();
        Array.from(imagenes).forEach((imagen, index) => {
            formdata.append(`imagen${index}`, imagen);
        });
        try{
            const response = await fetch(`http://localhost:5000/imagenes/guardar`, {
                method: 'POST',
                body: formdata
            }).then((response) => response.json()).then((data) => {
                console.log(data);
                const arr = data['rutas_imagenes'];
                console.log("El resultado es: ",arr[0]);
                registrar(nombre, descripcion, precio, stock, categoriasSeleccionadas, contacto, idUsuario, arr[0]);

                return arr[0];
            });
        } catch(error){
            console.log('Error al subir las imagenes: ',error);
        }
    }

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
