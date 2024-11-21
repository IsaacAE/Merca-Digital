from flask import Blueprint, session, request, url_for, redirect
from Model import model_compra as mc
import json

compra_blueprint = Blueprint('compra', __name__, url_prefix="/compra")

@compra_blueprint.route('/agregar', methods=['POST'])
def agregar_compra():
    try:
        idUsuario = request.form.get('idUsuario')
        total = request.form.get('total')
        fecha = request.form.get('fecha')
        compra = mc.create_compra(idUsuario, total, fecha)
        if compra == -1:
            return json.dumps({'error': 'No se pudo agregar la compra'})
        return json.dumps(compra.to_dict())
    except:
        return json.dumps({'error': 'No se pudo agregar la compra por falta de datos'})
    
@compra_blueprint.route('/get', methods=['GET'])
def get_compras():
    try:
        idUsuario = request.args.get('idUsuario')
        compras = mc.get_compras(idUsuario)
        if compras == -1:
            return json.dumps({'error': 'No se pudo obtener las compras'})
        return json.dumps([compra.to_dict() for compra in compras])
    except:
        return json.dumps({'error': 'No se pudo obtener las compras por falta de datos'})
    
@compra_blueprint.route('/getConProductos/<idUsuario>')
def get_compras_con_productos(idUsuario):
    try:
        compras = mc.get_compras_con_productos(idUsuario)
        if compras == -1:
            return json.dumps({'error': 'No se pudo obtener las compras'})
        return compras
    except:
        return json.dumps({'error': 'No se pudo obtener las compras por falta de datos'})