# Importación de los módulos necesarios
from flask import Blueprint, session, request, url_for, redirect
from Model import model_contener as mc
import json

# Creación del Blueprint para gestionar las rutas relacionadas con los productos en una compra
contener_blueprint = Blueprint('contener', __name__, url_prefix="/contener")

# Ruta para agregar un producto a una compra
@contener_blueprint.route('/agregar', methods=['POST'])
def agregar_producto():
    try:
        # Obtener los datos enviados en la solicitud
        idCompra = request.form.get('idCompra')
        idProducto = request.form.get('idProducto')
        cantidad = request.form.get('cantidad')
        importe = request.form.get('importe')
        
        # Llamar a la función para agregar el producto a la compra
        contener = mc.agregarProducto(idCompra, idProducto, cantidad, importe)
        
        # Si no se pudo agregar el producto, devolver un mensaje de error
        if contener == -1:
            return json.dumps({'error': 'No se pudo agregar el producto a la compra'})
        
        # Si el producto fue agregado correctamente, devolver sus detalles en formato JSON
        return json.dumps(contener.to_dict())
    except:
        # Manejo de excepciones: si faltan datos, devolver un mensaje de error
        return json.dumps({'error': 'No se pudo agregar el producto a la compra por falta de datos'})

# Ruta para calificar un producto en una compra
@contener_blueprint.route('/calificar', methods=['POST'])
def calificar_producto():
    try:
        # Obtener los datos enviados en la solicitud
        idCompra = request.form.get('idCompra')
        idProducto = request.form.get('idProducto')
        calificacion = request.form.get('calificacion')
        
        # Llamar a la función para agregar una calificación al producto
        contener = mc.agregar_calificacion(idCompra, idProducto, calificacion)
        
        # Si no se pudo calificar el producto, devolver un mensaje de error
        if contener == -1:
            return json.dumps({'error': 'No se pudo calificar el producto'})
        
        # Si la calificación fue agregada correctamente, devolver sus detalles en formato JSON
        return json.dumps(contener.to_dict())
    except:
        # Manejo de excepciones: si faltan datos, devolver un mensaje de error
        return json.dumps({'error': 'No se pudo calificar el producto por falta de datos'})

# Ruta para revisar la existencia de un producto
@contener_blueprint.route('/revisar', methods=['POST'])
def revisar_producto():
    try:
        # Obtener el idProducto desde la solicitud
        idProducto = request.form.get('idProducto')
        
        # Llamar a la función para revisar la existencia del producto
        contener = mc.revisar_existencia(idProducto)
        
        # Si no se pudo revisar el producto, devolver un mensaje de error
        if contener == -1:
            return json.dumps({'error': 'No se pudo revisar el producto'})
        
        # Devolver el resultado de la revisión en formato JSON
        return json.dumps(contener)
    except:
        # Manejo de excepciones: si faltan datos, devolver un mensaje de error
        return json.dumps({'error': 'No se pudo comentar el producto por falta de datos'})

# Ruta para comentar sobre un producto en una compra
@contener_blueprint.route('/comentar', methods=['POST'])
def comentar_producto():
    try:
        # Obtener los datos enviados en la solicitud
        idCompra = request.form.get('idCompra')
        idProducto = request.form.get('idProducto')
        comentario = request.form.get('comentario')
        
        # Llamar a la función para agregar un comentario al producto
        contener = mc.agregar_comentario(idCompra, idProducto, comentario)
        
        # Si no se pudo comentar el producto, devolver un mensaje de error
        if contener == -1:
            return json.dumps({'error': 'No se pudo comentar el producto'})
        
        # Si el comentario fue agregado correctamente, devolver sus detalles en formato JSON
        return json.dumps(contener.to_dict())
    except:
        # Manejo de excepciones: si faltan datos, devolver un mensaje de error
        return json.dumps({'error': 'No se pudo comentar el producto por falta de datos'})

# Ruta para obtener los productos de una compra
@contener_blueprint.route('/productos/<idCompra>', methods=['GET'])
def get_productos_de_compra(idCompra):
    # Llamar a la función para obtener los productos de la compra
    contener = mc.get_productos_de_compra(idCompra)
    
    # Si no se pudieron obtener los productos, devolver un mensaje de error
    if contener == -1:
        return json.dumps({'error': 'No se pudieron obtener los productos de la compra'})
    
    # Devolver los productos en formato JSON
    return json.dumps([cont.to_dict() for cont in contener])

# Ruta para obtener los productos de un usuario
@contener_blueprint.route('/productos/usuario/<idUsuario>', methods=['GET'])
def get_productos_de_usuario(idUsuario):
    # Llamar a la función para obtener los productos del usuario
    contener = mc.get_productos_de_usuario(idUsuario)
    
    # Si no se pudieron obtener los productos, devolver un mensaje de error
    if contener == -1:
        return json.dumps({'error': 'No se pudieron obtener los productos del usuario'})
    
    # Devolver los productos en formato JSON
    return json.dumps([cont.to_dict() for cont in contener])

# Ruta para actualizar el comentario y la calificación de un producto en una compra
@contener_blueprint.route('/reseniar', methods=['POST'])
def actualizar_comentario_y_calificacion():
    try:
        # Obtener los datos enviados en la solicitud
        idCompra = request.form.get('idCompra')
        idProducto = request.form.get('idProducto')
        comentario = request.form.get('comentario')
        calificacion = request.form.get('calificacion')
        
        # Llamar a la función para actualizar el comentario y la calificación del producto
        contener = mc.actualizar_comentario_y_calificacion(idCompra, idProducto, comentario, calificacion)
        
        # Si no se pudo actualizar el comentario y la calificación, devolver un mensaje de error
        if contener == -1:
            return json.dumps({'error': 'No se pudo actualizar el comentario y la calificación'})
        
        # Si la actualización fue exitosa, devolver los detalles en formato JSON
        return json.dumps(contener.to_dict())
    except:
        # Manejo de excepciones: si faltan datos, devolver un mensaje de error
        return json.dumps({'error': 'No se pudo actualizar el comentario y la calificación por falta de datos'})

# Ruta para obtener las opiniones (comentarios y calificaciones) de un producto
@contener_blueprint.route('/opiniones/<idProducto>', methods=['GET'])
def revisar_opiniones(idProducto):
    try:
        # Llamar a la función para obtener las opiniones del producto
        contener = mc.obtener_opiniones(idProducto)
        
        # Si no se pudieron obtener las opiniones, devolver un mensaje de error
        if contener == -1:
            return json.dumps({'error': 'No se pudo obtener las opiniones'})
        
        # Devolver las opiniones en formato JSON
        return json.dumps([cont.to_dict() for cont in contener])
    except:
        # Manejo de excepciones: si faltan datos, devolver un mensaje de error
        return json.dumps({'error': 'No se pudo obtener las opiniones por falta de datos'})

