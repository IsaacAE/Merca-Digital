# Importación de clases y módulos necesarios
from alchemyClasses.Almacenar import Almacenar  # Clase que representa la tabla 'Almacenar'
from alchemyClasses.Producto import Producto  # Clase que representa la tabla 'Producto'
from alchemyClasses import db  # Objeto de base de datos
from flask import jsonify  # Para crear respuestas JSON
from sqlalchemy import text  # Para ejecutar consultas SQL crudas

# Función para agregar un producto al carrito
def agregar_al_carrito(idProducto, idCarrito, numero):
    """
    Agrega una cantidad específica de un producto al carrito.
    Si ya existe el producto en el carrito, actualiza la cantidad.
    Si no hay suficiente stock, ajusta la cantidad al máximo disponible.
    """
    # Obtiene el producto de la tabla Producto
    p = Producto.query.filter(Producto.idProducto == idProducto).first()
    cantidad = int(p.cantidad)  # Stock disponible del producto
    por_agregar = int(numero)  # Cantidad solicitada para agregar

    # Ajusta la cantidad a agregar si supera el stock disponible
    if cantidad < por_agregar:
        por_agregar = cantidad

    # Busca si el producto ya está en el carrito
    producto = Almacenar.query.filter(Almacenar.idProducto == idProducto, Almacenar.idCarrito == idCarrito).first()
    if producto is None:  # Si no existe, crea un nuevo registro
        new_producto = Almacenar(idCarrito, idProducto, por_agregar)
        try:
            db.session.add(new_producto)
            db.session.commit()
            return new_producto  # Devuelve el producto agregado
        except:
            return -1  # Error al agregar el producto
    else:  # Si ya existe, actualiza la cantidad
        if producto.cantidad + por_agregar > cantidad:
            producto.cantidad = cantidad  # Ajusta al máximo stock disponible
        else:
            producto.cantidad += por_agregar  # Incrementa la cantidad

        try:
            db.session.commit()
            return producto  # Devuelve el producto actualizado
        except:
            return -1  # Error al actualizar el producto

# Función para editar la cantidad de un producto en el carrito
def editar_cantidad(idProducto, idCarrito, numero):
    """
    Modifica directamente la cantidad de un producto en el carrito.
    """
    producto = Almacenar.query.filter(Almacenar.idProducto == idProducto, Almacenar.idCarrito == idCarrito).first()
    if producto is None:  # Si el producto no está en el carrito
        print(f'El producto con id: {idProducto} no está en el carrito con id: {idCarrito}')
        return -1
    producto.cantidad = int(numero)  # Actualiza la cantidad
    try:
        db.session.commit()
        return producto  # Devuelve el producto actualizado
    except:
        return -1  # Error al actualizar

# Función para aumentar en 1 la cantidad de un producto en el carrito
def aumentar_cantidad_producto(idProducto, idCarrito):
    """
    Incrementa en 1 la cantidad de un producto en el carrito.
    """
    producto = Almacenar.query.filter(Almacenar.idProducto == idProducto, Almacenar.idCarrito == idCarrito).first()
    if producto is None:
        print(f'El producto con id: {idProducto} no está en el carrito con id: {idCarrito}')
        return -1
    producto.cantidad += 1  # Incrementa la cantidad en 1
    try:
        db.session.commit()
        return producto  # Devuelve el producto actualizado
    except:
        return -1  # Error al actualizar

# Función para quitar un producto del carrito
def quitar_del_carrito(idProducto, idCarrito):
    """
    Elimina un producto del carrito.
    """
    producto = Almacenar.query.filter(Almacenar.idProducto == idProducto, Almacenar.idCarrito == idCarrito).first()
    if producto is None:
        print(f'El producto con id: {idProducto} no está en el carrito con id: {idCarrito}')
        return -1
    try:
        db.session.delete(producto)
        db.session.commit()
        return 1  # Operación exitosa
    except:
        return -1  # Error al eliminar

# Función para limpiar todos los productos del carrito
def limpiar_carrito(idCarrito):
    """
    Elimina todos los productos del carrito.
    """
    Almacenar.query.filter(Almacenar.idCarrito == idCarrito).delete()
    try:
        db.session.commit()
        return 1  # Operación exitosa
    except:
        return -1  # Error al eliminar

# Función para obtener los productos de un carrito
def obtener_productos_de_carrito(idCarrito):
    """
    Devuelve todos los productos almacenados en un carrito específico.
    """
    productos = Almacenar.query.filter(Almacenar.idCarrito == idCarrito).all()
    if not productos:
        print(f'El carrito con id: {idCarrito} no tiene productos')
        return -1
    return productos

# Función para obtener información detallada de los productos en un carrito
def obtener_productos_de_carrito(idCarrito):
    """
    Devuelve información detallada de los productos en el carrito, incluyendo su cantidad en el carrito.
    """
    query = text(
        'SELECT p.*, a.cantidad AS cantidad_carrito '
        'FROM Producto AS p '
        'JOIN Almacenar AS a ON p.idProducto = a.idProducto '
        'WHERE a.idCarrito = :idCarrito'
    )
    productos = db.session.execute(query, {'idCarrito': idCarrito})
    if productos is None:
        print(f'El carrito con id: {idCarrito} no tiene productos')
        return -1
    return productos.fetchall()  # Devuelve los resultados como una lista de filas

