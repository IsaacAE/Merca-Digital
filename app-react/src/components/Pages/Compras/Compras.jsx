import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from 'axios';
import "./Compras.css";
import { Navigate, useNavigate } from "react-router-dom";

export default function Compras() {
    const [compras, setCompras] = useState([]);
    const [cookies, setCookies] = useCookies(['userToken']);
    const navigation = useNavigate();

    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/compra/getConProductos/${cookies.user['idComprador']}`);
                console.log(response.data);
                if (response.data.error) {
                    console.log("No se pudo hacer update");
                } else {
                    const updated = response.data.map(
                        compra => ({
                            ...compra,
                            productos: compra.productos.map(
                                producto => ({
                                    ...producto,
                                    fotourl: `http://localhost:5000/imagenes/${producto.foto}`
                                })
                            )
                        })
                    );
                    setCompras(updated);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchCompras();
    }, [cookies.user]);

    function goBack() {
        navigation(-1);
    }

    function dejar_comen_calif(idCompra, idProducto) {
        navigation(`/resenia/${idCompra}/${idProducto}`);
    }

    return (
        <>
            <div className="fullscreen-shape"></div>
            <button type="button" className="btn-regresar" onClick={goBack}><i className="bi bi-arrow-left" /></button>

            <h1 className="text-white">Mis compras</h1>
            <div className="text-center">
            <h3 className="text-gray">¡No olvides dar click a los productos para reseñarlos!</h3>
            </div>
            <div className="container">
                <div className="row">
                    <table className="tabla">
                        <thead>
                            <tr>
                                <th className="th1">Fecha</th>
                                <th className="th1">Productos</th>
                                <th className="th1">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {compras.map(
                                compra => (
                                    <tr className="tr1" key={compra.idCompra}>
                                        <td className="td1">{compra.fecha.substring(0, 16)}</td>
                                        <td className="td1">
                                            <table className="tabla2">
                                                <tbody>
                                                    {compra.productos.map(
                                                        producto => (
                                                            <tr key={producto.idProducto} onClick={() => dejar_comen_calif(compra.idCompra, producto.idProducto)}>
                                                                <td>
                                                                    <img src={`http://localhost:5000/imagenes/${producto.foto}`} alt={producto.nombre} className="img-compras" />
                                                                </td>
                                                                <td>
                                                                    <span className="ms-2">{producto.nombreProducto}</span>
                                                                </td>
                                                                <td>
                                                                    <span className="ms-2">Cantidad: {producto.cantidad}</span>
                                                                </td>
                                                                <td>
                                                                    <span>Importe: $ {producto.importe}</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </td>
                                        <td className="td1">$ {compra.total}</td>
                                    </tr>)
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
