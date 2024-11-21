import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import StarRating from "./StarRating.jsx"; // Asegúrate de importar el componente StarRating
import './ReseniaForm.css';

const Resenia = () => {
  const { idCompra, idProducto } = useParams();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['userToken']);
  const [producto, setProducto] = useState(null);
  const [foto, setFoto] = useState(null);
  const [comentario, setComentario] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/producto/read/${idProducto}`);
       
        setProducto(response.data);

        setFoto(`http://localhost:5000/imagenes/${response.data.foto}`);
        
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProducto();
  }, [idProducto]);

  const goBack = () => {
    navigate(-1);
  };

  const handleCommentChange = (event) => {
    setComentario(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('idCompra', idCompra);
    formdata.append('idProducto', idProducto);
    formdata.append('comentario', comentario);
    formdata.append('calificacion', rating);

    try {
        const response = await fetch(`http://localhost:5000/contener/reseniar`, {
            method: 'POST',
            body: formdata
        }).then((response) => response.json()).then((data) => {
            console.log(data);
            try {
                if (data['error'] === "No se pudo actualizar el comentario y la calificación") {
                 
                    Error('No se pudo actualizar el comentario y la calificación');
                } else if(data['error'] ){
                  Error('No se pudo actualizar el comentario y la calificación');
                 } else{
                    console.log(data);
                    // Navegar a la ruta /miscompras después de enviar la reseña con éxito
                    navigate("/misCompras");
                }
            } catch (error) {
                Error('No se pudo actualizar el comentario y la calificación por falta de datos');
            }
        });

    } catch (error) {
        console.log(error);
    }
   
  };

  return (
    <>
      <div className="fullscreen-shape"></div>
      <button type="button" className="btn-regresar" onClick={goBack}><i className="bi bi-arrow-left" /></button>
      {producto && (
        <section className="py-5">
          <div className="container px-4 px-lg-5 my-5">
            <div className="row gx-4 gx-lg-5 align-items-center">
              <div className="col-md-6">
                <img className="card-img-top mb-5 mb-md-0 img-product" src={foto} alt={producto.nombreProducto} />
              </div>
              <div className="col-md-6">
                <h1 className="display-5 fw-bolder">{producto.nombreProducto}</h1>
                <p className="lead">{producto.descripcion}</p>
                <div className="star-rating">
                <StarRating rating={rating} onRatingChange={setRating} />
            </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Escribe tu comentario"
                    value={comentario}
                    onChange={handleCommentChange}
                  />
                </div>
                <button className={'btn btn-azul'} type="submit" onClick={handleSubmit}>Enviar Reseña</button>
              </div>
              
            </div>
            
          </div>
        </section>
      )}
    </>
  );
};

export default Resenia;
