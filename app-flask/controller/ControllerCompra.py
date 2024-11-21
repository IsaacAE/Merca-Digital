# Importación de los módulos necesarios
from flask import Blueprint, session, request, url_for, redirect
from Model import model_compra as mc
import json

# Creación del Blueprint para gestionar las rutas relacionadas con las compras
compra_blueprint = Blueprint('compra', __name__, url_prefix="/compra")

# Ruta para agregar una nueva compra
@compra_blueprint.route('/agregar', methods=['POST'])
def agregar_compra():
    try:
        # Obtener los datos enviados en la solicitud
        idUsuario = request.form.get('idUsuario')
        total = request.form.get('total')
        fecha = request.form.get('fecha')
        
        # Llamar a la función para crear una nueva compra
        compra = mc.create_compra(idUsuario, total, fecha)
        
        # Si no se pudo crear la compra, devolver un mensaje de error
        if compra == -1:
            return json.dumps({'error': 'No se pudo agregar la compra'})
        
        # Si la compra fue creada correctamente, devolver sus detalles en formato JSON
        return json.dumps(compra.to_dict())
    except:
        # Manejo de excepciones: si faltan datos, devolver un mensaje de error
        return json.dumps({'error': 'No se pudo agregar la compra por falta de datos'})

# Ruta para obtener todas las compras de un usuario
@compra_blueprint.route('/get', methods=['GET'])
def get_compras():
    try:
        # Obtener el idUsuario desde la solicitud
        idUsuario = request.args.get('idUsuario')
        
        # Llamar a la función para obtener las compras de un usuario
        compras = mc.get_compras(idUsuario)
        
        # Si no se pudieron obtener las compras, devolver un mensaje de error
        if compras == -1:
            return json.dumps({'error': 'No se pudo obtener las compras'})
        
        # Si se encontraron compras, devolverlas en formato JSON
        return json.dumps([compra.to_dict() for compra in compras])
    except:
        # Manejo de excepciones: si faltan datos, devolver un mensaje de error
        return json.dumps({'error': 'No se pudo obtener las compras por falta de datos'})

# Ruta para obtener las compras de un usuario junto con los productos asociados a cada compra
@compra_blueprint.route('/getConProductos/<idUsuario>')
def get_compras_con_productos(idUsuario):
    try:
        # Llamar a la función para obtener las compras junto con los productos
        compras = mc.get_compras_con_productos(idUsuario)
        
        # Si no se pudieron obtener las compras con productos, devolver un mensaje de error
        if compras == -1:
            return json.dumps({'error': 'No se pudo obtener las compras'})
        
        # Si se encontraron compras con productos, devolverlas en formato JSON
        return compras
    except:
        # Manejo de excepciones: si faltan datos, devolver un mensaje de error
        return json.dumps({'error': 'No se pudo obtener las compras por falta de datos'})

