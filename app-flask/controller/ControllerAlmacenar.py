# Importación de módulos necesarios
from flask import Blueprint, session, request, url_for, redirect
from Model import model_almacenar as ma
import json

# Creación del Blueprint para gestionar las rutas relacionadas con el carrito
almacenar_blueprint = Blueprint('carrito', __name__, url_prefix='/carrito')

# Ruta para agregar un producto al carrito. Se utiliza el método POST para recibir los datos.
@almacenar_blueprint.route('/agregar', methods=['POST'])
def agregar_al_carrito():
    try:
        # Obtener los datos enviados en la solicitud
        idProducto = request.form.get('idProducto')
        idCarrito = request.form.get('idCarrito')
        cantidad = request.form.get('cantidad')
        
        # Llamar a la función para agregar el producto al carrito
        almacenar = ma.agregar_al_carrito(idProducto, idCarrito, cantidad)
        
        # Si no se pudo agregar el producto, devolver un mensaje de error
        if almacenar == -1:
            return json.dumps({'error': 'No se pudo agregar el producto al carrito'})
        
        # Si se agregó correctamente, devolver los detalles del producto en formato JSON
        return json.dumps(almacenar.to_dict())
    except:
        # Manejo de excepciones: si falta algún dato, devolver un error
        return json.dumps({'error': 'No se pudo agregar el producto al carrito por falta de datos'})

# Ruta para aumentar la cantidad de un producto en el carrito
@almacenar_blueprint.route('/aumentar', methods=['POST'])
def aumentar_cantidad():
    try:
        # Obtener los datos enviados en la solicitud
        idProducto = request.form.get('idProducto')
        idCarrito = request.form.get('idCarrito')
        
        # Llamar a la función para aumentar la cantidad del producto en el carrito
        almacenar = ma.aumentar_cantidad_producto(idProducto, idCarrito)
        
        # Si no se pudo aumentar la cantidad, devolver un mensaje de error
        if almacenar == -1:
            return json.dumps({'error': 'No se pudo aumentar la cantidad del producto'})
        
        # Si la cantidad fue aumentada correctamente, devolver los detalles del producto en formato JSON
        return json.dumps(almacenar.to_dict())
    except:
        # Manejo de excepciones: si falta algún dato, devolver un error
        return json.dumps({'error': 'No se pudo aumentar la cantidad del producto por falta de datos'})

# Ruta para editar la cantidad de un producto en el carrito
@almacenar_blueprint.route('/editarCantidad', methods=['POST'])
def editar_cantidad():
    try:
        # Obtener los datos enviados en la solicitud
        idProducto = request.form.get('idProducto')
        idCarrito = request.form.get('idCarrito')
        cantidad = request.form.get('cantidad')
        
        # Llamar a la función para editar la cantidad del producto en el carrito
        almacenar = ma.editar_cantidad(idProducto, idCarrito, cantidad)
        
        # Si no se pudo editar la cantidad, devolver un mensaje de error
        if almacenar == -1:
            return json.dumps({'error': 'No se pudo editar la cantidad del producto'})
        
        # Si se editó correctamente, devolver los detalles del producto en formato JSON
        return json.dumps(almacenar.to_dict())
    except:
        # Manejo de excepciones: si falta algún dato, devolver un error
        return json.dumps({'error': 'No se pudo editar la cantidad del producto por falta de datos'})

# Ruta para eliminar un producto del carrito
@almacenar_blueprint.route('/eliminarProducto', methods=['POST'])
def eliminar_producto():
    try:
        # Obtener los datos enviados en la solicitud
        idProducto = request.form.get('idProducto')
        idCarrito = request.form.get('idCarrito')
        
        # Llamar a la función para eliminar el producto del carrito
        eliminado = ma.quitar_del_carrito(idProducto, idCarrito)
        
        # Si no se pudo eliminar el producto, devolver un mensaje de error
        if eliminado == -1:
            return json.dumps({'error': 'No se pudo eliminar el producto del carrito'})
        
        # Si se eliminó correctamente, devolver un mensaje de éxito
        return json.dumps({'success': 'Producto eliminado del carrito'})
    except:
        # Manejo de excepciones: si falta algún dato, devolver un error
        return json.dumps({'error': 'No se pudo eliminar el producto del carrito por falta de datos'})

# Ruta para limpiar todo el carrito
@almacenar_blueprint.route('/limpiar/<idCarrito>', methods=['POST', 'GET'])
def limpiar_carrito(idCarrito):
    # Llamar a la función para limpiar el carrito
    eliminado = ma.limpiar_carrito(idCarrito)
    
    # Si no se pudo limpiar el carrito, devolver un mensaje de error
    if eliminado == -1:
        return json.dumps({'error': 'No se pudo limpiar el carrito'})
    
    # Si se limpió correctamente, devolver un mensaje de éxito
    return json.dumps({'success': 'Carrito limpiado'})

# Ruta para obtener los productos de un carrito específico
@almacenar_blueprint.route('/productos/<idCarrito>', methods=['GET'])
def obtener_productos(idCarrito):
    # Llamar a la función para obtener los productos del carrito
    productos = ma.obtener_productos_de_carrito(idCarrito)
    
    # Si no se encontraron productos, devolver un mensaje de error
    if productos == -1:
        return json.dumps({'error': 'No se encontraron productos en el carrito'})
    
    # Si se encontraron productos, devolverlos en formato JSON
    return json.dumps([producto.to_dict() for producto in productos])

# Ruta para obtener información detallada de los productos en un carrito
@almacenar_blueprint.route('/productosInfo/<idCarrito>', methods=['GET'])
def productos_info(idCarrito):
    # Llamar a la función para obtener los productos del carrito
    productos = ma.obtener_productos_de_carrito(idCarrito)
    
    contador = 0
    dict = []
    
    # Iterar sobre los productos obtenidos y formatear los datos para la respuesta
    for fila in productos:
        contador += 1
        dict.append({
            'idProducto': fila[0], 
            'idUsuario': fila[1], 
            'nombreProducto': fila[2], 
            'descripcion': fila[3],
            'foto': fila[4],
            'precio': str(fila[5]),
            'contacto': fila[6],
            'cantidad': fila[7],
            'cantidad_carrito': fila[8]
        })
    
    # Devolver la lista de productos con sus detalles en formato JSON
    return json.dumps(dict)

