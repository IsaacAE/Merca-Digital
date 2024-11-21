from flask import Blueprint, session, request, url_for, redirect
from Model import model_tener as mt
import json

tener_blueprint = Blueprint('tener', __name__, url_prefix='/tener')


@tener_blueprint.route('/read', methods=['GET'])
def read_tener():
    tener = mt.read_tener()
    if tener == -1:
        return json.dumps({'error': 'No hay usuarios con carrito'})
    return json.dumps(tener.to_dict())

@tener_blueprint.route('/readU/<idUsuario>', methods=['GET'])
def read_tener_by_idUsuario(idUsuario):
    tener = mt.find_tener_by_idUsuario(idUsuario)
    if tener == -1:
        return json.dumps({'error': 'No se encontró el usuario con carrito'})
    return json.dumps(tener.to_dict())

@tener_blueprint.route('/readC/<idCarrito>', methods=['GET'])
def read_tener_by_idCarrito(idCarrito):
    tener = mt.find_tener_by_idCarrito(idCarrito)
    if tener == -1:
        return json.dumps({'error': 'No se encontró el carrito'})
    return json.dumps(tener.to_dict()) 
 