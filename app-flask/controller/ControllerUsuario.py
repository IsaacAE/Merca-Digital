from flask import Blueprint, session, request, url_for, redirect
from Model import model_usuarios as mu
from Model import model_tener as mt
from controller import ControllerTener
import json

usuario_blueprint = Blueprint('usuario', __name__, url_prefix='/usuario')


## Read
## Return a json
@usuario_blueprint.route('/read/<idUsuario>', methods=['GET'])
def read_user(idUsuario):
    user = mu.read_user(idUsuario)
    if user == -1:
        return json.dumps({'error': 'No se encontró el usuario'})
    return json.dumps(user.to_dict())

@usuario_blueprint.route('/read', methods=['GET'])
def read_users():
    users = mu.read_users()
    if users == -1:
        return json.dumps({'error': 'No hay usuarios'})
    return json.dumps([user.to_dict() for user in users])


@usuario_blueprint.route('/login', methods=['POST'])
def login():
    try:
        correo = request.form.get('correo')
        contraseña = request.form.get('contraseña')
        user = mu.find_user_by_email_and_password(correo, contraseña)

        if user == -1:
            return json.dumps({'error': 'usuario_incorrecto'})
        elif user == -2:
            return json.dumps({'error': 'contraseña_incorrecta'})
    
        
        session['user_id'] = user.idUsuario
        
        if(user.vendedor == 0 ):
            usuario_y_carrito = mt.find_tener_by_idUsuario(user.idUsuario)
            if (usuario_y_carrito == -1):
                return json.dumps(user.to_dict())
            return json.dumps(usuario_y_carrito.to_dict())
            
        return json.dumps(user.to_dict())
    except Exception as e:
        print("Error:", e)
        return json.dumps({'error': 'Faltan datos'})
    
    
@usuario_blueprint.route('/create', methods=['POST'])
def create_user():
    try:
        nombre = request.form.get('nombre')
        apPat = request.form.get('apPat')
        apMat = request.form.get('apMat')
        correo = request.form.get('correo')
        telefono = request.form.get('telefono')
        contraseña = request.form.get('contraseña')
        imagen = request.form.get('imagen')
        vendedor = request.form.get('tipoCuenta')
        
        new_user = mu.create_user(nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor)
        if new_user == -1:
            return json.dumps({'error': 'No se pudo crear el usuario'})
        if new_user == -2:
            return json.dumps({'error': 'Ese correo ya esta registrado'})
        return json.dumps(new_user.to_dict())
    except:
        return json.dumps({'error': 'Faltan datos'})

    
@usuario_blueprint.route('/logout', methods=['GET'])
def logout():
    session.pop('user_id', None)
    #if session['carrito']:
    #   session.pop('carrito', None)
    return "Sesión cerrada"

## Update
## Receives an id
## Return a json
@usuario_blueprint.route('/update/<user>', methods=['POST'])
def update_user(user):
    try:
        idUsuario = user['idUsuario']
        nombre = user['nombre']
        apPat = user['apPat']
        apMat = user['apMat']
        correo = user['correo']
        telefono = user['telefono']
        contraseña = user['contraseña']
        imagen = user['imagen']
        vendedor = user['vendedor']
        updated_user = mu.update_user(idUsuario, nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor)
        if updated_user == -1:
            return json.dumps({'error': 'No se pudo actualizar el usuario'})
        return json.dumps(updated_user.to_dict())
    except:
        return json.dumps({'error': 'Faltan datos'})
    
@usuario_blueprint.route('/updateNombre/<idUsuario>/<nombre>', methods=['POST', 'GET'])
def update_nombre(idUsuario, nombre):
    print(idUsuario, nombre)
    user = mu.update_nombre(int(idUsuario), nombre)
    if user == -1:
        return json.dumps({'error': 'No se pudo actualizar el nombre'})
    return json.dumps(user.to_dict())

@usuario_blueprint.route('/updateApPat/<idUsuario>/<apellido>', methods=['POST'])
def update_apPat(idUsuario, apellido):
    user = mu.update_apPat(idUsuario, apellido)
    if user == -1:
        return json.dumps({'error': 'No se pudo actualizar el apellido paterno'})
    return json.dumps(user.to_dict())

@usuario_blueprint.route('updateApMat/<idUsuario>/<apellido>', methods=['POST'])
def update_apMat(idUsuario, apellido):
    user = mu.update_apMat(idUsuario, apellido)
    if user == -1:
        return json.dumps({'error': 'No se pudo actualizar el apellido materno'})
    return json.dumps(user.to_dict())

@usuario_blueprint.route('/updateCorreo/<idUsuario>/<correo>', methods=['POST'])
def update_correo(idUsuario, correo):
    print(correo)
    user = mu.update_correo(idUsuario, correo)
    if user == -1:
        return json.dumps({'error': 'No se pudo actualizar el correo'})
    if user == -2:
        print("se halla duplicado en controller")
        return json.dumps({'error': 'Ese correo ya esta registrado'})
    return json.dumps(user.to_dict())

@usuario_blueprint.route('/updateTelefono/<idUsuario>/<telefono>', methods=['POST'])
def update_telefono(idUsuario, telefono):
    user = mu.update_telefono(idUsuario, telefono)
    if user == -1:
        return json.dumps({'error': 'No se pudo actualizar el telefono'})
    return json.dumps(user.to_dict())
    
## Delete
## Receives an id
## Return a json
@usuario_blueprint.route('/delete/<idUsuario>', methods=['GET'])
def delete_user(idUsuario):
    #idUsuario = request.args.get('idUsuario')
    user = mu.delete_user(idUsuario)
    if user == -1:
        return json.dumps({'error': 'No se pudo borrar el usuario'})
    return json.dumps(user.to_dict())
