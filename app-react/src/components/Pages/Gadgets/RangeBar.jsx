import React from 'react';
import { Range, getTrackBackground } from 'react-range'; // Importa el componente Range y la función getTrackBackground
import './RangeBar.css'; // Importa el archivo CSS para los estilos

// Componente RangeSlider que recibe las propiedades min, max, step, values y onChange
const RangeSlider = ({ min, max, step, values, onChange }) => {
  return (
    <div className="range-slider"> {/* Contenedor principal del slider */}
      <Range
        values={values} // Valor actual del slider (un array con dos valores)
        step={step} // Paso de incremento/decremento del slider
        min={min} // Valor mínimo del slider
        max={max} // Valor máximo del slider
        onChange={onChange} // Función que se ejecuta cuando el valor cambia
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style, // Mantiene los estilos de props
              background: getTrackBackground({
                values, // Valores actuales del slider
                colors: ['#ccc', '#548BF4', '#ccc'], // Colores para la parte de la pista antes, durante y después del slider
                min: min, // Valor mínimo
                max: max // Valor máximo
              }),
            }}
            className="range-slider-track" // Clase para aplicar estilos al track
          >
            {children} {/* Representa los "thumbs" (deslizadores) */}
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props} 
            className="range-slider-thumb" // Clase para el thumb
          >
            <div
              className="range-slider-thumb-inner"
              style={{
                backgroundColor: isDragged ? '#548BF4' : '#CCC' // Cambia el color del thumb dependiendo si está siendo arrastrado
              }}
            />
          </div>
        )}
      />
      
      {/* Mostrar los valores actuales del slider */}
      <div className="range-slider-output">
        <output>{values[0]}</output> {/* Valor mínimo */}
        <output>{values[1]}</output> {/* Valor máximo */}
      </div>
    </div>
  );
};

export default RangeSlider;

