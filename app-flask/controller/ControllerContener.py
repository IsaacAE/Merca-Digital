from flask import Blueprint, session, request, url_for, redirect
from Model import model_contener as mc
import json

contener_blueprint = Blueprint('contener', __name__, url_prefix="/contener")

@contener_blueprint.route('/agregar', methods=['POST'])
def agregar_producto():
    try:
        idCompra = request.form.get('idCompra')
        idProducto = request.form.get('idProducto')
        cantidad = request.form.get('cantidad')
        importe = request.form.get('importe')
        contener = mc.agregarProducto(idCompra, idProducto, cantidad, importe)
        if contener == -1:
            return json.dumps({'error': 'No se pudo agregar el producto a la compra'})
        return json.dumps(contener.to_dict())
    except:
        return json.dumps({'error': 'No se pudo agregar el producto a la compra por falta de datos'})
    
@contener_blueprint.route('/calificar', methods=['POST'])
def calificar_producto():
    try:
        idCompra = request.form.get('idCompra')
        idProducto = request.form.get('idProducto')
        calificacion = request.form.get('calificacion')
        contener = mc.agregar_calificacion(idCompra, idProducto, calificacion)
        if contener == -1:
            return json.dumps({'error': 'No se pudo calificar el producto'})
        return json.dumps(contener.to_dict())
    except:
        return json.dumps({'error': 'No se pudo calificar el producto por falta de datos'})
    
@contener_blueprint.route('/revisar', methods=['POST'])
def revisar_producto():
    try:
       
        idProducto = request.form.get('idProducto')

        contener = mc.revisar_existencia(idProducto)
        if contener == -1:
            return json.dumps({'error': 'No se pudo revisar el producto'})
        return json.dumps(contener)
    except:
        return json.dumps({'error': 'No se pudo comentar el producto por falta de datos'})
    
@contener_blueprint.route('/comentar', methods=['POST'])
def comentar_producto():
    try:
        idCompra = request.form.get('idCompra')
        idProducto = request.form.get('idProducto')
        comentario = request.form.get('comentario')
        contener = mc.agregar_comentario(idCompra, idProducto, comentario)
        if contener == -1:
            return json.dumps({'error': 'No se pudo comentar el producto'})
        return json.dumps(contener.to_dict())
    except:
        return json.dumps({'error': 'No se pudo comentar el producto por falta de datos'})
    
@contener_blueprint.route('/productos/<idCompra>', methods=['GET'])
def get_productos_de_compra(idCompra):
    contener = mc.get_productos_de_compra(idCompra)
    if contener == -1:
        return json.dumps({'error': 'No se pudieron obtener los productos de la compra'})
    return json.dumps([cont.to_dict() for cont in contener])

@contener_blueprint.route('/productos/usuario/<idUsuario>', methods=['GET'])
def get_productos_de_usuario(idUsuario):
    contener = mc.get_productos_de_usuario(idUsuario)
    if contener == -1:
        return json.dumps({'error': 'No se pudieron obtener los productos del usuario'})
    return json.dumps([cont.to_dict() for cont in contener])

@contener_blueprint.route('/reseniar', methods=['POST'])
def actualizar_comentario_y_calificacion():
    try:
        idCompra = request.form.get('idCompra')
        idProducto = request.form.get('idProducto')
        comentario = request.form.get('comentario')
        calificacion = request.form.get('calificacion')
        contener = mc.actualizar_comentario_y_calificacion(idCompra, idProducto, comentario, calificacion)
        if contener == -1:
            return json.dumps({'error': 'No se pudo actualizar el comentario y la calificación'})
        return json.dumps(contener.to_dict())
    except:
        return json.dumps({'error': 'No se pudo actualizar el comentario y la calificación por falta de datos'})
    
@contener_blueprint.route('/opiniones/<idProducto>', methods=['GET'])
def revisar_opiniones(idProducto):
    try:
        contener = mc.obtener_opiniones(idProducto)
        if contener == -1:
            return json.dumps({'error': 'No se pudo actualizar el comentario y la calificación'})
        return json.dumps([cont.to_dict() for cont in contener])
    except:
        return json.dumps({'error': 'No se pudo actualizar el comentario y la calificación por falta de datos'})
