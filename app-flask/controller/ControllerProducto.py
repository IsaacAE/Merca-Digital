from flask import Blueprint, session, request, url_for, redirect
from Model import model_productos as mp
import json

producto_blueprint = Blueprint('producto', __name__, url_prefix='/producto')


## Read
## Return a json
@producto_blueprint.route('/read/<idProducto>', methods=['GET'])
def read_product(idProducto):
    product = mp.read_product(idProducto)
    if product == -1:
        return json.dumps({'error': 'No se encontró el producto'})
    return json.dumps(product.to_dict())

@producto_blueprint.route('/read', methods=['GET'])
def read_products():
    products = mp.read_products()
    if products == -1:
        return json.dumps({'error': 'No hay productos'})
    return json.dumps([product.to_dict() for product in products])

@producto_blueprint.route('/readV/<idVendedor>', methods=['GET'])
def read_products_vendor(idVendedor):
    products = mp.read_products_vendor(idVendedor)
    if products == -1:
        return json.dumps({'error': 'No hay productos'})
    return json.dumps([product.to_dict() for product in products])

    
    
@producto_blueprint.route('/create', methods=['POST'])
def create_product():
    try:
        idUsuario = request.form.get('idUsuario')
        nombreProducto = request.form.get('nombreProducto')
        descripcion = request.form.get('descripcion')
        foto = request.form.get('imagen')
        precio = request.form.get('precio')
        contacto = request.form.get('contacto')
        cantidad = request.form.get('cantidad')
       
        
        new_product = mp.create_product(idUsuario, nombreProducto, descripcion, foto, precio, contacto, cantidad)
        if new_product == -1:
            return json.dumps({'error': 'No se pudo crear el producto'})
        return json.dumps(new_product.to_dict())
    except:
        return json.dumps({'error': 'Faltan datos'})
  
    


## Update
## Receives an id
## Return a json
@producto_blueprint.route('/update', methods=['POST'])
def update_product():
    try:
        idProducto = request.form.get('idProducto')
        idUsuario = request.form.get('idUsuario')
        nombreProducto = request.form.get('nombreProducto')
        descripcion = request.form.get('descripcion')
        foto = request.form.get('imagen')
        precio = request.form.get('precio')
        contacto = request.form.get('contacto')
        cantidad = request.form.get('cantidad')
        updated_product = mp.update_product(idProducto, idUsuario, nombreProducto, descripcion, foto, precio, contacto, cantidad)
        if updated_product == -1:
            return json.dumps({'error': 'No se pudo actualizar el producto'})
        elif updated_product == -2:
            return json.dumps({'error': 'No autorizado para actualizar producto'})
        return json.dumps(updated_product.to_dict())
    except:
        return json.dumps({'error': 'Faltan datos'})
    
    
## Delete
## Receives an id
## Return a json
@producto_blueprint.route('/delete/<idProducto>', methods=['GET'])
def delete_product(idProducto):
    #idProducto = request.args.get('idProducto')
    product = mp.delete_product(idProducto)
    if product == -1:
        return json.dumps({'error': 'No se pudo borrar el producto'})
    return json.dumps(product.to_dict())

#Read
#Receives an category
#Return a json
@producto_blueprint.route('/read/categoria/<categoria>', methods=['GET'])
def read_products_by_category(categoria):
    products = mp.productos_por_categoria(categoria)
    if products == -1:
        return json.dumps({'error': 'No se pudieron obtener los productos de la categoría'})
    return json.dumps([product.to_dict() for product in products])


@producto_blueprint.route('/read/buscador/nombre/<palabra>', methods=['GET'])
def search_products_by_name(palabra):
    products = mp.products_by_name(palabra)
    if products == -1:
        return json.dumps({'error': 'No se pudieron obtener los productos con ese nombre'})
    return json.dumps([product.to_dict() for product in products])

@producto_blueprint.route('/read/buscador/precio/<precio>', methods=['GET'])
def search_products_by_price(precio):
    min, max = map(int, precio.split(','))
    products = mp.products_by_price(min,max)
    if products == -1:
        return json.dumps({'error': 'No se pudieron obtener los productos con ese nombre'})
    return json.dumps([product.to_dict() for product in products])


@producto_blueprint.route('/read/checks/<dataValues>', methods=['GET'])
def search_products_by_checks(dataValues):
    nombre,categoria, min, max = dataValues.split(',')
    min_price = float(min) if min else 0.0
    max_price = float(max) if max else 1000000.0
    
    products = mp.products_by_check(nombre, categoria, min_price, max_price)
    if products == -1:
        return json.dumps({'error': 'No se pudieron obtener los productos con esas condiciones'})
    return json.dumps([product.to_dict() for product in products])

    

@producto_blueprint.route('/nombreImagen', methods=['POST'])
def get_image_name():
    idProducto = request.form.get('idProducto')  # Obtener el parámetro del cuerpo de la solicitud JSON
    nombre_imagen = mp.get_product_image(idProducto)  # Suponiendo que "mp" es el módulo que contiene la función read_products
    if nombre_imagen == -1:
        return json.dumps({'error': 'No hay productos'})
    return json.dumps(nombre_imagen)


@producto_blueprint.route('/check', methods=['POST'])
def get_verification():
    idProducto = request.form.get('idProducto')
    idUsuario= request.form.get('idUsuario') 
    check = mp.get_verification(idProducto, idUsuario)  # Suponiendo que "mp" es el módulo que contiene la función read_products
    if check == -1:
        return json.dumps({'error': 'No hay productos'})
    return json.dumps(check)

@producto_blueprint.route('/reactivar/<idProducto>', methods=['GET'])
def reactivate_product(idProducto):
    product = mp.reactivate_product(idProducto)
    if product == -1:
        return json.dumps({'error': 'No se pudo reactivar el producto'})
    return json.dumps(product.to_dict())
