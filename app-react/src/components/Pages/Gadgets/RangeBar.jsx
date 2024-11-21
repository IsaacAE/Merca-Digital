import React from 'react';
import { Range, getTrackBackground } from 'react-range';
import './RangeBar.css'; // Importa el archivo CSS

const RangeSlider = ({ min, max, step, values, onChange }) => {
  return (
    <div className="range-slider">
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              background: getTrackBackground({
                values,
                colors: ['#ccc', '#548BF4', '#ccc'],
                min: min,
                max: max
              }),
            }}
            className="range-slider-track"
          >
            {children}
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            className="range-slider-thumb"
          >
            <div
              className="range-slider-thumb-inner"
              style={{
                backgroundColor: isDragged ? '#548BF4' : '#CCC'
              }}
            />
          </div>
        )}
      />
      <div className="range-slider-output">
        <output>{values[0]}</output>
        <output>{values[1]}</output>
      </div>
    </div>
  );
};

export default RangeSlider;
