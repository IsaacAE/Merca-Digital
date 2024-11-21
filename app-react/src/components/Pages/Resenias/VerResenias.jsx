// Importaciones necesarias
import React, { useState, useEffect } from 'react'; // Hooks de React
import { useParams, useNavigate } from 'react-router-dom'; // Hooks para manejar parámetros de URL y navegación
import axios from 'axios'; // Cliente HTTP para realizar peticiones a la API
import logo from '../../../Images/logo.png'; // Imagen para mostrar en las tarjetas
import './VerResenias.css'; // Estilos específicos para este componente

// Componente principal
const Opiniones = () => {
    const { idProducto } = useParams(); // Hook para obtener el ID del producto desde la URL
    const [opiniones, setOpiniones] = useState([]); // Estado para almacenar las opiniones
    const [calificacionPromedio, setCalificacionPromedio] = useState(0); // Estado para la calificación promedio
    const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
    const navigate = useNavigate(); // Hook para manejar la navegación

    // Hook para obtener las opiniones desde la API al montar el componente
    useEffect(() => {
        axios.get(`http://localhost:5000/contener/opiniones/${idProducto}`) // Petición GET a la API
            .then(response => {
                const opiniones = response.data; // Obtener los datos de la respuesta
                // Filtrar los datos relevantes (calificación y comentario)
                const opinionesFiltradas = opiniones.map(opinion => ({
                    calificacion: opinion.calificacion,
                    comentario: opinion.comentario
                }));
                setOpiniones(opinionesFiltradas); // Actualizar el estado con las opiniones filtradas

                // Calcular la calificación promedio si hay opiniones
                if (opinionesFiltradas.length > 0) {
                    const calif = opinionesFiltradas.reduce((acc, opinion) => acc + opinion.calificacion, 0);
                    setCalificacionPromedio((calif / opinionesFiltradas.length).toFixed(2)); // Redondear a 2 decimales
                }

                setLoading(false); // Desactivar el estado de carga
            })
            .catch(error => {
                console.error('Error fetching opinions:', error); // Manejo de errores
                setLoading(false); // Desactivar el estado de carga aunque ocurra un error
            });
    }, [idProducto]); // Solo se ejecuta cuando cambia `idProducto`

    // Función para regresar a la página anterior
    const goBack = () => {
        navigate(-1); // Navega hacia atrás en el historial
    };

    // Renderizado del componente
    return (
        <section className="py-5 bg-gris">
            {/* Fondo decorativo */}
            <div className="fullscreen-shape"></div>

            {/* Contenedor principal */}
            <div className="container px-4 px-lg-5 mt-5">
                {/* Botón para regresar */}
                <div className="d-flex align-items-center mb-4">
                    <button type="button" className="btn-regresar left-aligned" onClick={goBack}>
                        <i className="bi bi-arrow-left" /> {/* Ícono de flecha */}
                    </button>
                </div>
                {/* Título de la sección */}
                <h2 className="fw-bolder text-white mb-0">Reseñas</h2>
                
                {/* Mensaje de carga o resultados */}
                {loading ? (
                    <h3 className="fw-bolder mb-4 text-white">Cargando...</h3> // Mostrar mientras se cargan datos
                ) : opiniones.length > 0 ? (
                    <h3 className="fw-bolder mb-4 text-white">Calificación promedio: {calificacionPromedio}/5</h3> // Mostrar promedio
                ) : (
                    <h3 className="fw-bolder mb-4 text-white">Sin calificaciones</h3> // Mostrar si no hay opiniones
                )}

                {/* Renderizado de opiniones */}
                <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                    {opiniones.map((opinion, index) => (
                        <div className="col mb-5" key={index}>
                            <div className="card h-100">
                                {/* Imagen representativa */}
                                <img className="card-img-top" src={logo} alt="Logo" />
                                <div className="card-body p-4">
                                    <div className="text-center">
                                        {/* Título de la reseña */}
                                        <h5 className="fw-bolder">Reseña: {index + 1}</h5>
                                        {/* Comentario */}
                                        <p>{opinion.comentario}</p>
                                        {/* Mostrar estrellas según la calificación */}
                                        <div>
                                            {Array.from({ length: opinion.calificacion }, (_, i) => (
                                                <span key={i} className="star">&#9733;</span> // Estrella
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                    {/* Espacio para detalles adicionales */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Exportación del componente
export default Opiniones;

