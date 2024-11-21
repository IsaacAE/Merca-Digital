import './Card.css'; // Importa el archivo CSS para los estilos del componente

// Definición del componente Card
export default function Card({ message, handleConfirm, handleCancel }) {
    return (
        // Contenedor principal de la tarjeta de confirmación
        <div className='confirmation-card'>
            {/* Muestra el mensaje proporcionado como prop */}
            <p>{message}</p>

            {/* Botón para confirmar la acción, ejecuta handleConfirm al hacer clic */}
            <button onClick={handleConfirm}>Confirm</button>

            {/* Botón para cancelar la acción, ejecuta handleCancel al hacer clic */}
            <button onClick={handleCancel}>Cancel</button>
        </div>
    );
}

