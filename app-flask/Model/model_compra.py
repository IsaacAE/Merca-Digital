# Importación de clases y módulos necesarios
from alchemyClasses.Compra import Compra  # Clase que representa la tabla 'Compra'
from alchemyClasses.Contener import Contener  # Clase que representa la tabla 'Contener'
from alchemyClasses.Producto import Producto  # Clase que representa la tabla 'Producto'
from alchemyClasses import db  # Objeto de base de datos
from flask import jsonify  # Para crear respuestas JSON

# CRUD para gestionar compras

# Función para crear una nueva compra
def create_compra(idUsuario, total, fecha):
    """
    Crea una nueva compra para un usuario dado.
    """
    new_compra = Compra(idUsuario=idUsuario, total=total, fecha=fecha)  # Crea un nuevo objeto Compra
    try:
        # Intenta agregar la nueva compra a la base de datos
        db.session.add(new_compra)
        db.session.commit()  # Guarda los cambios en la base de datos
        return new_compra  # Devuelve la compra creada
    except Exception as e:
        print(e)  # Imprime el error si ocurre
        return -1  # Si ocurre un error, devuelve -1

# Función para obtener todas las compras de un usuario
def get_compras(idUsuario):
    """
    Obtiene todas las compras realizadas por un usuario.
    """
    compras = Compra.query.filter_by(idUsuario=idUsuario).all()  # Obtiene todas las compras de ese usuario
    return compras  # Devuelve la lista de compras

# Función para obtener compras con los productos relacionados
def get_compras_con_productos(idUsuario):
    """
    Obtiene todas las compras de un usuario junto con los productos y detalles asociados a cada compra.
    """
    try:
        # Realiza un JOIN entre las tablas Compra, Contener y Producto
        compras_con_detalles = db.session.query(Compra, Contener, Producto)\
            .join(Contener, Compra.idCompra == Contener.idCompra)\
            .join(Producto, Contener.idProducto == Producto.idProducto)\
            .filter(Compra.idUsuario == idUsuario)\
            .all()  # Ejecuta la consulta y obtiene los resultados

        # Crear un diccionario para almacenar las compras y sus productos asociados
        compras_dict = {}
        for compra, contener, producto in compras_con_detalles:
            # Si la compra no existe en el diccionario, la agregamos
            if compra.idCompra not in compras_dict:
                compras_dict[compra.idCompra] = {
                    'idCompra': compra.idCompra,
                    'idUsuario': compra.idUsuario,
                    'total': compra.total,
                    'fecha': compra.fecha,
                    'productos': []  # Inicializamos la lista de productos vacía
                }
            # Agregamos la información del producto a la lista de productos de la compra
            compras_dict[compra.idCompra]['productos'].append({
                'idProducto': producto.idProducto,
                'nombreProducto': producto.nombreProducto,
                'descripcion': producto.descripcion,
                'foto': producto.foto,
                'idVendedor': producto.idUsuario,
                'cantidad': contener.cantidad,
                'importe': contener.importe,
                'calificacion': contener.calificacion,
                'comentario': contener.comentario
            })

        # Convertimos el diccionario de compras en una lista de compras
        compras_list = list(compras_dict.values())

        return jsonify(compras_list)  # Devuelve la lista de compras con sus productos en formato JSON
    except Exception as e:
        print(e)  # Imprime el error si ocurre
        return -1  # Si ocurre un error, devuelve -1

