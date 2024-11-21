# Importación de los módulos necesarios
from flask import Blueprint, session, request, url_for, redirect
from Model import model_categoria as mc
import json

# Creación del Blueprint para gestionar las rutas relacionadas con las categorías
categoria_blueprint = Blueprint('categoria', __name__, url_prefix='/categoria')

# Ruta para crear una categoría para un producto específico
@categoria_blueprint.route('/create', methods=['POST'])
def create_categoria():
    try:
        # Obtener los datos enviados en la solicitud
        idProducto = int(request.form.get('idProducto'))
        categoria = request.form.get('categoria')
        
        # Llamar a la función para crear una nueva categoría para el producto
        new_category = mc.create_categoria(idProducto=idProducto, categoria=categoria)
        
        # Si no se pudo crear la categoría, devolver un mensaje de error
        if new_category == -1:
            return json.dumps({'error': 'No se pudo crear la categoria'})
        
        # Si la categoría fue creada correctamente, devolver sus detalles en formato JSON
        return json.dumps(new_category.to_dict())
    except:
        # Manejo de excepciones: si faltan datos, devolver un mensaje de error
        return json.dumps({'error': 'Faltan datos'})

# Ruta para crear varias categorías para un producto dado un array de categorías
@categoria_blueprint.route('/createByArray', methods=['GET'])
def create_categorias():
    # Obtener el idProducto y las categorías desde la solicitud
    idProducto = request.args.get('idProducto')
    categorias = request.args.get('categorias')
    
    # Iterar sobre el array de categorías y crear cada una de ellas
    for categoria in categorias:
        new_category = mc.create_categoria(idProducto, categoria)
        
        # Si alguna categoría no se pudo crear, devolver un mensaje de error
        if new_category == -1:
            return json.dumps({'error': 'No se pudo crear la categoria'})
    
    # Si todas las categorías fueron creadas correctamente, devolver un mensaje de éxito
    return json.dumps({'success': 'Categorias creadas'})

# Ruta para leer las categorías de un producto específico
@categoria_blueprint.route('/read', methods=['GET'])
def read_categorias():
    # Obtener el idProducto desde la solicitud
    idProducto = request.args.get('idProducto')
    
    # Llamar a la función para obtener las categorías de un producto
    categorias = mc.categorias_de_producto(idProducto)
    
    # Si no se encontraron categorías, devolver un mensaje de error
    if categorias == -1:
        return json.dumps({'error': 'No hay categorias'})
    
    # Si se encontraron categorías, devolverlas en formato JSON
    return json.dumps([categoria.to_dict() for categoria in categorias])

# Ruta para eliminar todas las categorías de un producto
@categoria_blueprint.route('/delete', methods=['POST'])
def delete_categorias():
    # Obtener el idProducto desde la solicitud
    idProducto = int(request.form.get('idProducto'))
    
    # Llamar a la función para eliminar las categorías del producto
    deleted = mc.delete_categorias(idProducto)
    
    # Si no se pudieron borrar las categorías, devolver un mensaje de error
    if deleted == -1:
        return json.dumps({'error': 'No se pudieron borrar las categorias'})
    
    # Si las categorías fueron borradas correctamente, devolver un mensaje de éxito
    return json.dumps({'success': 'Categorias borradas'})

