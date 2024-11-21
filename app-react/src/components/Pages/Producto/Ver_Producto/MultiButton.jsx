import React, { useState } from 'react';
import './Ver_Producto.css'


const ButtonGroup = () => {
  const [showButtons, setShowButtons] = useState(false);

  const handleClick = () => {
    setShowButtons(true);
  };

                        
  return (
    <div>
      <button onClick={handleClick} className="btn btn-outline-light mt-auto">
      <i className="bi bi-gear" /> Opciones
      </button>
      {showButtons && (
        <div className="button-container">
          <button className={'editar m-2'}><i class="bi bi-pencil-square"/>Editar</button>
          <button className="bi bi-trash3">Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default ButtonGroup;
