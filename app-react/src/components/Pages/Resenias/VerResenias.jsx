import React, { useState, useEffect} from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import logo from '../../../Images/logo.png';
import './VerResenias.css';

const Opiniones = () => {
    const { idProducto } = useParams();
    const [opiniones, setOpiniones] = useState([]);
    const navigate = useNavigate();
    const [calificacionPromedio, setCalificacionPromedio] = useState(0);
    

    useEffect(() => {
        axios.get(`http://localhost:5000/contener/opiniones/${idProducto}`).then(response => {
            const opiniones = response.data;
            const opinionesFiltradas = opiniones.map(opinion => ({
                calificacion: opinion.calificacion,
                comentario: opinion.comentario
            }));
            setOpiniones(opinionesFiltradas);
            if (opinionesFiltradas.length > 0) {
                let calif = 0;
                for (let opinion of opinionesFiltradas) {
                    calif += opinion.calificacion;
                }
                calif = calif / opinionesFiltradas.length;
                setCalificacionPromedio(calif);
            }
        }).catch(error => {
            console.error('Error fetching opinions:', error);
        });
    }, [idProducto]);

    const goBack = () => {
        navigate(-1)
    }

    return (
        <section className="py-5 bg-gris">
                   <div className="fullscreen-shape"></div>

            <div className="container px-4 px-lg-5 mt-5">
              <div className="d-flex align-items-center mb-4">
              <button type="button" className="btn-regresar left-aligned" onClick={goBack}>
    <i className="bi bi-arrow-left" />
</button>
                    
                </div>
                <h2 className="fw-bolder text-white mb-0">Reseñas</h2>
                {opiniones.length > 0 ? (
                    <h3 className="fw-bolder mb-4 text-white">Calificación promedio: {calificacionPromedio}/5</h3>
                ) : (
                    <h3 className="fw-bolder mb-4 text-white">Sin calificaciones</h3>
                )}
                <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                    {opiniones.map((opinion, index) => (
                        <div className="col mb-5" key={index}>
                            <div className="card h-100">
                                <img className="card-img-top" src= {logo} alt="..." />
                                <div className="card-body p-4">
                                    <div className="text-center">
                                        <h5 className="fw-bolder">Reseña: {index + 1}</h5>
                                        <p>{opinion.comentario}</p>
                                        <div>
                                            {Array.from({ length: opinion.calificacion }, (_, i) => (
                                                <span key={i}>&#9733;</span> // Imprime el símbolo de estrella
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
        </section>
    );
};

export default Opiniones;
