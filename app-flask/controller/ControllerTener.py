# Importación de los módulos necesarios
from flask import Blueprint, session, request, url_for, redirect
from Model import model_tener as mt
import json

# Creación del Blueprint para gestionar las rutas relacionadas con los carritos de los usuarios
tener_blueprint = Blueprint('tener', __name__, url_prefix='/tener')

# Ruta para obtener todos los carritos (Read)
@tener_blueprint.route('/read', methods=['GET'])
def read_tener():
    # Llamar a la función para obtener todos los carritos de los usuarios
    tener = mt.read_tener()
    if tener == -1:
        # Si no hay carritos, devolver un mensaje de error
        return json.dumps({'error': 'No hay usuarios con carrito'})
    # Si hay carritos, devolverlos en formato JSON
    return json.dumps(tener.to_dict())

# Ruta para obtener el carrito de un usuario específico por su idUsuario (Read)
@tener_blueprint.route('/readU/<idUsuario>', methods=['GET'])
def read_tener_by_idUsuario(idUsuario):
    # Llamar a la función para encontrar el carrito del usuario por su id
    tener = mt.find_tener_by_idUsuario(idUsuario)
    if tener == -1:
        # Si no se encuentra el carrito para ese usuario, devolver un mensaje de error
        return json.dumps({'error': 'No se encontró el usuario con carrito'})
    # Si el carrito es encontrado, devolverlo en formato JSON
    return json.dumps(tener.to_dict())

# Ruta para obtener un carrito específico por su idCarrito (Read)
@tener_blueprint.route('/readC/<idCarrito>', methods=['GET'])
def read_tener_by_idCarrito(idCarrito):
    # Llamar a la función para encontrar el carrito por su id
    tener = mt.find_tener_by_idCarrito(idCarrito)
    if tener == -1:
        # Si no se encuentra el carrito con ese id, devolver un mensaje de error
        return json.dumps({'error': 'No se encontró el carrito'})
    # Si el carrito es encontrado, devolverlo en formato JSON
    return json.dumps(tener.to_dict())

