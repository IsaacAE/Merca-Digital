// Importa SweetAlert2 para mostrar alertas personalizadas
import Swal from 'sweetalert2';

// Función para mostrar una alerta de error
export function Error(msj){
    return Swal.fire({
        position:"top-end", // Posiciona la alerta en la esquina superior derecha
        icon: "error", // Icono de tipo error
        title: msj, // El mensaje a mostrar en la alerta
        showConfirmButton: false, // No muestra el botón de confirmación
        timer: 1500 // La alerta se cierra automáticamente después de 1.5 segundos
    })
}

// Función para mostrar una alerta de éxito
export function Success(msj){
    return Swal.fire({
            position:"top-end", // Posiciona la alerta en la esquina superior derecha
            icon: "success", // Icono de tipo éxito
            title: msj, // El mensaje a mostrar en la alerta
            showConfirmButton: false, // No muestra el botón de confirmación
            timer: 1500 // La alerta se cierra automáticamente después de 1.5 segundos
        })
}

// Función para mostrar una alerta de confirmación con botones de "Sí" y "No"
export function Confirm(msj){
    return Swal.fire({
            title: msj, // El mensaje de confirmación
            showCancelButton: true, // Muestra el botón de cancelación
            confirmButtonText: "Yes", // Texto para el botón de confirmación
            cancelButtonText: "No", // Texto para el botón de cancelación
            showConfirmButton: false // No muestra el botón de confirmación, solo los botones personalizados
        })
}

// Función para mostrar una alerta de advertencia
export function Alert(msj){
    return Swal.fire({
            position:"top-end", // Posiciona la alerta en la esquina superior derecha
            icon: "warning", // Icono de tipo advertencia
            title: msj, // El mensaje a mostrar en la alerta
            showConfirmButton: false, // No muestra el botón de confirmación
            timer: 1500 // La alerta se cierra automáticamente después de 1.5 segundos
        })
}

