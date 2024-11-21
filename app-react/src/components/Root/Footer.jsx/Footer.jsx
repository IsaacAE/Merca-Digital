// Importa el archivo de estilo para el pie de página
import './Footer.css';

// Componente Footer que representa el pie de página
export default function Footer(){
    return(
        <div className="abajo">
            {/* Contenedor del pie de página con clase para estilo */}
            <footer className="py-5 bg-dark">
                <div className="container">
                    {/* Texto centrado en el pie de página, con el año de copyright */}
                    <p className="m-0 text-center text-white">Copyright &copy; Merca-Digital 2024</p>
                </div>
            </footer>
        </div>
    )
}

