# Importación de clases y módulos necesarios
from alchemyClasses.Contener import Contener  # Clase que representa la tabla 'Contener' (relación entre 'Compra' y 'Producto')
from alchemyClasses.Compra import Compra  # Clase que representa la tabla 'Compra'
from alchemyClasses import db  # Objeto de base de datos
from flask import jsonify  # Para crear respuestas JSON

# CRUD para manejar productos dentro de compras

# Función para agregar un producto a una compra
def agregarProducto(idCompra, idProducto, cantidad, importe):
    """
    Agrega un producto a una compra específica.
    """
    new_contener = Contener(idCompra=idCompra, idProducto=idProducto, cantidad=cantidad, importe=importe)  # Crea un nuevo registro en 'Contener'
    try:
        # Intenta agregar el nuevo producto a la compra en la base de datos
        db.session.add(new_contener)
        db.session.commit()  # Guarda los cambios en la base de datos
        return new_contener  # Devuelve el objeto creado
    except Exception as e:
        print(e)  # Imprime el error si ocurre
        return -1  # Si ocurre un error, devuelve -1

# Función para obtener todos los productos de una compra
def get_productos_de_compra(idCompra):
    """
    Obtiene todos los productos de una compra.
    """
    contener = Contener.query.filter_by(idCompra=idCompra).all()  # Obtiene todos los productos relacionados con la compra
    return contener  # Devuelve los productos encontrados

# Función para obtener todos los productos de todas las compras de un usuario
def get_productos_de_usuario(idUsuario):
    """
    Obtiene todos los productos de las compras realizadas por un usuario.
    """
    contener = Contener.query.join(Compra).filter(Compra.idUsuario == idUsuario).all()  # Realiza un JOIN entre 'Contener' y 'Compra'
    return contener  # Devuelve los productos encontrados en las compras del usuario

# Función para revisar si un producto está presente en alguna compra
def revisar_existencia(idProducto):
    """
    Revisa si un producto está presente en alguna compra.
    """
    prod = Contener.query.filter(Contener.idProducto == idProducto).first()  # Busca si el producto existe en alguna compra
    if prod:  # Si el producto está en alguna compra
       return True
    else:
       return False  # Si no existe, devuelve False

# Función para agregar una calificación a un producto dentro de una compra
def agregar_calificacion(idCompra, idProducto, calificacion):
    """
    Agrega una calificación a un producto en una compra específica.
    """
    contener = Contener.query.filter_by(idCompra=idCompra, idProducto=idProducto).first()  # Busca el producto en la compra
    contener.calificacion = calificacion  # Asigna la calificación
    db.session.commit()  # Guarda los cambios en la base de datos
    return contener  # Devuelve el objeto actualizado

# Función para agregar un comentario a un producto dentro de una compra
def agregar_comentario(idCompra, idProducto, comentario):
    """
    Agrega un comentario a un producto en una compra específica.
    """
    contener = Contener.query.filter_by(idCompra=idCompra, idProducto=idProducto).first()  # Busca el producto en la compra
    contener.comentario = comentario  # Asigna el comentario
    db.session.commit()  # Guarda los cambios en la base de datos
    return contener  # Devuelve el objeto actualizado

# Función para actualizar tanto comentario como calificación de un producto en una compra
def actualizar_comentario_y_calificacion(idCompra, idProducto, comentario, calificacion):
    """
    Actualiza tanto el comentario como la calificación de un producto en una compra.
    """
    contener = Contener.query.filter_by(idCompra=idCompra, idProducto=idProducto).first()  # Busca el producto en la compra
    if contener:
        contener.comentario = comentario  # Asigna el nuevo comentario
        contener.calificacion = calificacion  # Asigna la nueva calificación
        db.session.commit()  # Guarda los cambios en la base de datos
        return contener  # Devuelve el objeto actualizado
    else:
        return -1  # Si no se encuentra el producto, devuelve -1

# Función para obtener todas las opiniones (calificaciones) de un producto
def obtener_opiniones(idProducto):
    """
    Obtiene todas las opiniones (calificaciones) de un producto específico.
    """
    contener = Contener.query.filter(Contener.calificacion >= 0, Contener.idProducto == idProducto).all()  # Filtra las calificaciones de un producto
    return contener  # Devuelve las opiniones encontradas

