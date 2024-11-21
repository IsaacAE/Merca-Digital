from flask import Blueprint, session, request, url_for, redirect
from Model import model_categoria as mc
import json

categoria_blueprint = Blueprint('categoria', __name__, url_prefix='/categoria')

@categoria_blueprint.route('/create', methods=['POST'])
def create_categoria():
    try:
        idProducto = int(request.form.get('idProducto'))
        categoria = request.form.get('categoria')
        new_category = mc.create_categoria(idProducto=idProducto, categoria=categoria)
        if new_category == -1:
            return json.dumps({'error': 'No se pudo crear la categoria'})
        return json.dumps(new_category.to_dict())
    except:
        return json.dumps({'error': 'Faltan datos'})
    
# Dado un array de categorias, crea todas las categorias de un producto
@categoria_blueprint.route('/createByArray', methods=['GET'])
def create_categorias():
    idProducto = request.args.get('idProducto')
    categorias = request.args.get('categorias')
    for categoria in categorias:
        new_category = mc.create_categoria(idProducto, categoria)
        if new_category == -1:
            return json.dumps({'error': 'No se pudo crear la categoria'})
    return json.dumps({'success': 'Categorias creadas'})

@categoria_blueprint.route('/read', methods=['GET'])
def read_categorias():
    idProducto = request.args.get('idProducto')
    categorias = mc.categorias_de_producto(idProducto)
    if categorias == -1:
        return json.dumps({'error': 'No hay categorias'})
    return json.dumps([categoria.to_dict() for categoria in categorias])

@categoria_blueprint.route('/delete', methods=['POST'])
def delete_categorias():
    idProducto = int(request.form.get('idProducto'))
    deleted = mc.delete_categorias(idProducto)
    if deleted == -1:
        return json.dumps({'error': 'No se pudieron borrar las categorias'})
    return json.dumps({'success': 'Categorias borradas'})
