# Importación de los módulos necesarios
from flask import Blueprint, session, request, url_for, redirect
from Model import model_productos as mp
import json

# Creación del Blueprint para gestionar las rutas relacionadas con los productos
producto_blueprint = Blueprint('producto', __name__, url_prefix='/producto')

## Rutas para obtener productos (Read)

# Ruta para obtener un producto específico por su id
@producto_blueprint.route('/read/<idProducto>', methods=['GET'])
def read_product(idProducto):
    # Llamar a la función para obtener el producto
    product = mp.read_product(idProducto)
    if product == -1:
        return json.dumps({'error': 'No se encontró el producto'})
    return json.dumps(product.to_dict())

# Ruta para obtener todos los productos
@producto_blueprint.route('/read', methods=['GET'])
def read_products():
    # Llamar a la función para obtener todos los productos
    products = mp.read_products()
    if products == -1:
        return json.dumps({'error': 'No hay productos'})
    return json.dumps([product.to_dict() for product in products])

# Ruta para obtener productos de un vendedor específico
@producto_blueprint.route('/readV/<idVendedor>', methods=['GET'])
def read_products_vendor(idVendedor):
    # Llamar a la función para obtener productos de un vendedor
    products = mp.read_products_vendor(idVendedor)
    if products == -1:
        return json.dumps({'error': 'No hay productos'})
    return json.dumps([product.to_dict() for product in products])


## Ruta para crear un nuevo producto (Create)
@producto_blueprint.route('/create', methods=['POST'])
def create_product():
    try:
        # Obtener los datos enviados en la solicitud
        idUsuario = request.form.get('idUsuario')
        nombreProducto = request.form.get('nombreProducto')
        descripcion = request.form.get('descripcion')
        foto = request.form.get('imagen')
        precio = request.form.get('precio')
        contacto = request.form.get('contacto')
        cantidad = request.form.get('cantidad')
        
        # Llamar a la función para crear un nuevo producto
        new_product = mp.create_product(idUsuario, nombreProducto, descripcion, foto, precio, contacto, cantidad)
        
        # Si no se pudo crear el producto, devolver un mensaje de error
        if new_product == -1:
            return json.dumps({'error': 'No se pudo crear el producto'})
        
        # Si el producto fue creado correctamente, devolver sus detalles en formato JSON
        return json.dumps(new_product.to_dict())
    except:
        # Manejo de excepciones: si faltan datos, devolver un mensaje de error
        return json.dumps({'error': 'Faltan datos'})

## Rutas para actualizar un producto (Update)
@producto_blueprint.route('/update', methods=['POST'])
def update_product():
    try:
        # Obtener los datos enviados en la solicitud
        idProducto = request.form.get('idProducto')
        idUsuario = request.form.get('idUsuario')
        nombreProducto = request.form.get('nombreProducto')
        descripcion = request.form.get('descripcion')
        foto = request.form.get('imagen')
        precio = request.form.get('precio')
        contacto = request.form.get('contacto')
        cantidad = request.form.get('cantidad')
        
        # Llamar a la función para actualizar el producto
        updated_product = mp.update_product(idProducto, idUsuario, nombreProducto, descripcion, foto, precio, contacto, cantidad)
        
        # Si no se pudo actualizar el producto, devolver un mensaje de error
        if updated_product == -1:
            return json.dumps({'error': 'No se pudo actualizar el producto'})
        elif updated_product == -2:
            return json.dumps({'error': 'No autorizado para actualizar producto'})
        
        # Si el producto fue actualizado correctamente, devolver sus detalles en formato JSON
        return json.dumps(updated_product.to_dict())
    except:
        # Manejo de excepciones: si faltan datos, devolver un mensaje de error
        return json.dumps({'error': 'Faltan datos'})

## Ruta para eliminar un producto (Delete)
@producto_blueprint.route('/delete/<idProducto>', methods=['GET'])
def delete_product(idProducto):
    # Llamar a la función para eliminar el producto
    product = mp.delete_product(idProducto)
    
    # Si no se pudo borrar el producto, devolver un mensaje de error
    if product == -1:
        return json.dumps({'error': 'No se pudo borrar el producto'})
    
    # Si el producto fue borrado correctamente, devolver sus detalles en formato JSON
    return json.dumps(product.to_dict())

## Rutas para obtener productos por categoría o búsqueda (Read)

# Ruta para obtener productos por categoría
@producto_blueprint.route('/read/categoria/<categoria>', methods=['GET'])
def read_products_by_category(categoria):
    # Llamar a la función para obtener productos por categoría
    products = mp.productos_por_categoria(categoria)
    if products == -1:
        return json.dumps({'error': 'No se pudieron obtener los productos de la categoría'})
    return json.dumps([product.to_dict() for product in products])

# Ruta para buscar productos por nombre
@producto_blueprint.route('/read/buscador/nombre/<palabra>', methods=['GET'])
def search_products_by_name(palabra):
    # Llamar a la función para buscar productos por nombre
    products = mp.products_by_name(palabra)
    if products == -1:
        return json.dumps({'error': 'No se pudieron obtener los productos con ese nombre'})
    return json.dumps([product.to_dict() for product in products])

# Ruta para buscar productos por rango de precio
@producto_blueprint.route('/read/buscador/precio/<precio>', methods=['GET'])
def search_products_by_price(precio):
    # Obtener el rango de precio (min, max)
    min, max = map(int, precio.split(','))
    
    # Llamar a la función para buscar productos por precio
    products = mp.products_by_price(min, max)
    if products == -1:
        return json.dumps({'error': 'No se pudieron obtener los productos con ese rango de precio'})
    return json.dumps([product.to_dict() for product in products])

# Ruta para buscar productos según múltiples criterios (nombre, categoría, precio)
@producto_blueprint.route('/read/checks/<dataValues>', methods=['GET'])
def search_products_by_checks(dataValues):
    # Desglosar los valores de búsqueda (nombre, categoría, min, max)
    nombre, categoria, min, max = dataValues.split(',')
    min_price = float(min) if min else 0.0
    max_price = float(max) if max else 1000000.0
    
    # Llamar a la función para buscar productos con múltiples condiciones
    products = mp.products_by_check(nombre, categoria, min_price, max_price)
    if products == -1:
        return json.dumps({'error': 'No se pudieron obtener los productos con esas condiciones'})
    return json.dumps([product.to_dict() for product in products])

## Rutas adicionales para la verificación y gestión de imágenes

# Ruta para obtener el nombre de la imagen de un producto
@producto_blueprint.route('/nombreImagen', methods=['POST'])
def get_image_name():
    # Obtener el idProducto desde la solicitud
    idProducto = request.form.get('idProducto')
    
    # Llamar a la función para obtener el nombre de la imagen
    nombre_imagen = mp.get_product_image(idProducto)
    if nombre_imagen == -1:
        return json.dumps({'error': 'No hay productos'})
    return json.dumps(nombre_imagen)

# Ruta para verificar un producto por el id del usuario
@producto_blueprint.route('/check', methods=['POST'])
def get_verification():
    # Obtener los parámetros de la solicitud
    idProducto = request.form.get('idProducto')
    idUsuario = request.form.get('idUsuario')
    
    # Llamar a la función para obtener la verificación
    check = mp.get_verification(idProducto, idUsuario)
    if check == -1:
        return json.dumps({'error': 'No hay productos'})
    return json.dumps(check)

# Ruta para reactivar un producto desactivado
@producto_blueprint.route('/reactivar/<idProducto>', methods=['GET'])
def reactivate_product(idProducto):
    # Llamar a la función para reactivar un producto
    product = mp.reactivate_product(idProducto)
    if product == -1:
        return json.dumps({'error': 'No se pudo reactivar el producto'})
    return json.dumps(product.to_dict())

