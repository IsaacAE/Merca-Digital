// Importa Outlet desde react-router-dom para renderizar las rutas hijas
import { Outlet } from "react-router-dom";
// Importa los componentes de navegación y pie de página
import Navigation from './Navigation/Navigation.jsx';
import Footer from "./Footer.jsx/Footer.jsx";

// Componente raíz de la aplicación
export default function Root(){
    return(
        <>
            {/* Contenedor principal con estilo para asegurar que ocupe toda la altura de la pantalla */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                
                {/* Componente de navegación que se muestra en la parte superior */}
                <Navigation/>
                
                {/* Contenedor para las rutas hijas, donde se renderizan las páginas dependiendo de la ruta */}
                <main>
                    <Outlet/>
                </main>
            </div>

            {/* Componente de pie de página que se muestra al final de la página */}
            <Footer/>
        </>
    )
}

