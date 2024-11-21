from flask import Blueprint, session, request, url_for, redirect
from Model import model_almacenar as ma
import json

almacenar_blueprint = Blueprint('carrito', __name__, url_prefix='/carrito')


@almacenar_blueprint.route('/agregar', methods=['POST'])
def agregar_al_carrito():
    try:
        idProducto = request.form.get('idProducto')
        idCarrito = request.form.get('idCarrito')
        cantidad = request.form.get('cantidad')
        almacenar = ma.agregar_al_carrito(idProducto, idCarrito, cantidad)
        if almacenar == -1:
            return json.dumps({'error': 'No se pudo agregar el producto al carrito'})
        return json.dumps(almacenar.to_dict())
    except:
        return json.dumps({'error': 'No se pudo agregar el producto al carrito por falta de datos'})


@almacenar_blueprint.route('/aumentar', methods=['POST'])
def aumentar_cantidad():
    try:
        idProducto = request.form.get('idProducto')
        idCarrito = request.form.get('idCarrito')
        almacenar = ma.aumentar_cantidad_producto(idProducto, idCarrito)
        if almacenar == -1:
            return json.dumps({'error': 'No se pudo aumentar la cantidad del producto'})
        return json.dumps(almacenar.to_dict())
    except:
        return json.dumps({'error': 'No se pudo aumentar la cantidad del producto por falta de datos'})
 
 
@almacenar_blueprint.route('/editarCantidad', methods=['POST'])
def editar_cantidad():
    try:
        idProducto = request.form.get('idProducto')
        idCarrito = request.form.get('idCarrito')
        cantidad = request.form.get('cantidad')
        almacenar = ma.editar_cantidad(idProducto, idCarrito, cantidad)
        if almacenar == -1:
            return json.dumps({'error': 'No se pudo editar la cantidad del producto'})
        return json.dumps(almacenar.to_dict())
    except:
        return json.dumps({'error': 'No se pudo editar la cantidad del producto por falta de datos'})
    
@almacenar_blueprint.route('/eliminarProducto', methods=['POST'])
def eliminar_producto():
    try:
        idProducto = request.form.get('idProducto')
        idCarrito = request.form.get('idCarrito')
        eliminado = ma.quitar_del_carrito(idProducto, idCarrito)
        if eliminado == -1:
            return json.dumps({'error': 'No se pudo eliminar el producto del carrito'})
        return json.dumps({'success': 'Producto eliminado del carrito'})
    except:
        return json.dumps({'error': 'No se pudo eliminar el producto del carrito por falta de datos'})
    
@almacenar_blueprint.route('/limpiar/<idCarrito>', methods=['POST', 'GET'])
def limpiar_carrito(idCarrito):
    eliminado = ma.limpiar_carrito(idCarrito)
    if eliminado == -1:
        return json.dumps({'error': 'No se pudo limpiar el carrito'})
    return json.dumps({'success': 'Carrito limpiado'})
    
@almacenar_blueprint.route('/productos/<idCarrito>', methods=['GET'])
def obtener_productos(idCarrito):
    productos = ma.obtener_productos_de_carrito(idCarrito)
    if productos == -1:
        return json.dumps({'error': 'No se encontraron productos en el carrito'})
    return json.dumps([producto.to_dict() for producto in productos])


@almacenar_blueprint.route('/productosInfo/<idCarrito>', methods=['GET'])
def productos_info(idCarrito):
    productos = ma.obtener_productos_de_carrito(idCarrito)
    contador=0
    dict = []
    for fila in productos:
        contador +=1
        #print(fila)
        dict.append({'idProducto': fila[0], 
                         'idUsuario': fila[1], 
                         'nombreProducto': fila[2], 
                         'descripcion': fila[3],
                         'foto': fila[4],
                         'precio': str(fila[5]),
                         'contacto': fila[6],
                         'cantidad': fila[7],
                        'cantidad_carrito': fila[8]}
                        )

    return json.dumps(dict)