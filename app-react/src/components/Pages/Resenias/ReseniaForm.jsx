import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import StarRating from "./StarRating.jsx"; // Asegúrate de importar el componente StarRating
import './ReseniaForm.css';

const Resenia = () => {
  const { idCompra, idProducto } = useParams(); // Obtiene los parámetros de la URL
  const navigate = useNavigate(); // Hook para la navegación programática
  const [cookies, setCookie] = useCookies(['userToken']); // Hook para las cookies
  const [producto, setProducto] = useState(null); // Estado para almacenar los datos del producto
  const [foto, setFoto] = useState(null); // Estado para almacenar la URL de la imagen del producto
  const [comentario, setComentario] = useState(""); // Estado para almacenar el comentario del usuario
  const [rating, setRating] = useState(0); // Estado para almacenar la calificación del producto

  // useEffect para cargar los datos del producto cuando el componente se monta
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/producto/read/${idProducto}`);
        setProducto(response.data); // Guardamos los datos del producto en el estado
        setFoto(`http://localhost:5000/imagenes/${response.data.foto}`); // Establecemos la URL de la foto
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProducto(); // Llamamos a la función para obtener los datos del producto
  }, [idProducto]); // Se ejecuta cada vez que cambia `idProducto`

  // Función para regresar a la página anterior
  const goBack = () => {
    navigate(-1); // Navega hacia atrás
  };

  // Función para manejar el cambio en el comentario
  const handleCommentChange = (event) => {
    setComentario(event.target.value);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    const formdata = new FormData();
    formdata.append('idCompra', idCompra);
    formdata.append('idProducto', idProducto);
    formdata.append('comentario', comentario);
    formdata.append('calificacion', rating);

    try {
      // Enviar la reseña al servidor
      const response = await fetch(`http://localhost:5000/contener/reseniar`, {
        method: 'POST',
        body: formdata
      });

      const data = await response.json();

      // Comprobamos si hubo algún error en la respuesta del servidor
      if (data['error']) {
        // Muestra un mensaje de error si no se pudo actualizar
        Error('No se pudo actualizar el comentario y la calificación');
      } else {
        // Si la reseña fue exitosa, navegamos a la página de mis compras
        navigate("/misCompras");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Error('Hubo un problema al enviar la reseña.');
    }
  };

  return (
    <>
      <div className="fullscreen-shape"></div>
      <button type="button" className="btn-regresar" onClick={goBack}>
        <i className="bi bi-arrow-left" />
      </button>

      {producto && (
        <section className="py-5">
          <div className="container px-4 px-lg-5 my-5">
            <div className="row gx-4 gx-lg-5 align-items-center">
              <div className="col-md-6">
                {/* Imagen del producto */}
                <img className="card-img-top mb-5 mb-md-0 img-product" src={foto} alt={producto.nombreProducto} />
              </div>
              <div className="col-md-6">
                <h1 className="display-5 fw-bolder">{producto.nombreProducto}</h1>
                <p className="lead">{producto.descripcion}</p>

                {/* Componente de calificación */}
                <div className="star-rating">
                  <StarRating rating={rating} onRatingChange={setRating} />
                </div>

                {/* Caja de texto para el comentario */}
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Escribe tu comentario"
                    value={comentario}
                    onChange={handleCommentChange}
                  />
                </div>

                {/* Botón para enviar la reseña */}
                <button className={'btn btn-azul'} type="button" onClick={handleSubmit}>Enviar Reseña</button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Resenia;

