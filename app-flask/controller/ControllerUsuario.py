# Importación de los módulos necesarios
from flask import Blueprint, session, request, url_for, redirect
from Model import model_usuarios as mu
from Model import model_tener as mt
from controller import ControllerTener
import json

# Creación del Blueprint para gestionar las rutas relacionadas con los usuarios
usuario_blueprint = Blueprint('usuario', __name__, url_prefix='/usuario')

## Read (Lectura de información de usuarios)

# Ruta para obtener los detalles de un usuario por su idUsuario
@usuario_blueprint.route('/read/<idUsuario>', methods=['GET'])
def read_user(idUsuario):
    user = mu.read_user(idUsuario)
    if user == -1:
        # Si el usuario no existe, devolver un mensaje de error
        return json.dumps({'error': 'No se encontró el usuario'})
    # Si el usuario existe, devolver sus datos en formato JSON
    return json.dumps(user.to_dict())

# Ruta para obtener todos los usuarios
@usuario_blueprint.route('/read', methods=['GET'])
def read_users():
    users = mu.read_users()
    if users == -1:
        # Si no hay usuarios, devolver un mensaje de error
        return json.dumps({'error': 'No hay usuarios'})
    # Si hay usuarios, devolver la lista en formato JSON
    return json.dumps([user.to_dict() for user in users])

# Ruta para iniciar sesión de un usuario
@usuario_blueprint.route('/login', methods=['POST'])
def login():
    try:
        correo = request.form.get('correo')
        contraseña = request.form.get('contraseña')
        # Buscar usuario por correo y contraseña
        user = mu.find_user_by_email_and_password(correo, contraseña)

        if user == -1:
            # Si el correo no está registrado, devolver error
            return json.dumps({'error': 'usuario_incorrecto'})
        elif user == -2:
            # Si la contraseña es incorrecta, devolver error
            return json.dumps({'error': 'contraseña_incorrecta'})
        
        # Guardar el idUsuario en la sesión para la autenticación posterior
        session['user_id'] = user.idUsuario
        
        # Si el usuario no es vendedor, buscar su carrito
        if(user.vendedor == 0 ):
            usuario_y_carrito = mt.find_tener_by_idUsuario(user.idUsuario)
            if usuario_y_carrito == -1:
                return json.dumps(user.to_dict())
            return json.dumps(usuario_y_carrito.to_dict())
        
        # Si el usuario es vendedor, devolver solo sus datos
        return json.dumps(user.to_dict())
    except Exception as e:
        print("Error:", e)
        # Si ocurre algún error durante el login, devolver mensaje de error
        return json.dumps({'error': 'Faltan datos'})

# Ruta para crear un nuevo usuario
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
        
        # Crear un nuevo usuario
        new_user = mu.create_user(nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor)
        if new_user == -1:
            # Si no se puede crear el usuario, devolver mensaje de error
            return json.dumps({'error': 'No se pudo crear el usuario'})
        if new_user == -2:
            # Si el correo ya está registrado, devolver error
            return json.dumps({'error': 'Ese correo ya esta registrado'})
        # Si el usuario es creado correctamente, devolver sus datos
        return json.dumps(new_user.to_dict())
    except:
        # Si falta algún dato al crear el usuario, devolver mensaje de error
        return json.dumps({'error': 'Faltan datos'})

# Ruta para cerrar sesión de un usuario
@usuario_blueprint.route('/logout', methods=['GET'])
def logout():
    # Eliminar el idUsuario de la sesión
    session.pop('user_id', None)
    return "Sesión cerrada"

## Update (Actualización de información de usuarios)

# Ruta para actualizar los datos de un usuario
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
            # Si no se puede actualizar el usuario, devolver mensaje de error
            return json.dumps({'error': 'No se pudo actualizar el usuario'})
        return json.dumps(updated_user.to_dict())
    except:
        # Si falta algún dato durante la actualización, devolver mensaje de error
        return json.dumps({'error': 'Faltan datos'})

# Ruta para actualizar el nombre de un usuario
@usuario_blueprint.route('/updateNombre/<idUsuario>/<nombre>', methods=['POST', 'GET'])
def update_nombre(idUsuario, nombre):
    print(idUsuario, nombre)
    user = mu.update_nombre(int(idUsuario), nombre)
    if user == -1:
        return json.dumps({'error': 'No se pudo actualizar el nombre'})
    return json.dumps(user.to_dict())

# Ruta para actualizar el apellido paterno de un usuario
@usuario_blueprint.route('/updateApPat/<idUsuario>/<apellido>', methods=['POST'])
def update_apPat(idUsuario, apellido):
    user = mu.update_apPat(idUsuario, apellido)
    if user == -1:
        return json.dumps({'error': 'No se pudo actualizar el apellido paterno'})
    return json.dumps(user.to_dict())

# Ruta para actualizar el apellido materno de un usuario
@usuario_blueprint.route('updateApMat/<idUsuario>/<apellido>', methods=['POST'])
def update_apMat(idUsuario, apellido):
    user = mu.update_apMat(idUsuario, apellido)
    if user == -1:
        return json.dumps({'error': 'No se pudo actualizar el apellido materno'})
    return json.dumps(user.to_dict())

# Ruta para actualizar el correo de un usuario
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

# Ruta para actualizar el teléfono de un usuario
@usuario_blueprint.route('/updateTelefono/<idUsuario>/<telefono>', methods=['POST'])
def update_telefono(idUsuario, telefono):
    user = mu.update_telefono(idUsuario, telefono)
    if user == -1:
        return json.dumps({'error': 'No se pudo actualizar el telefono'})
    return json.dumps(user.to_dict())

## Delete (Eliminación de un usuario)

# Ruta para eliminar un usuario por su idUsuario
@usuario_blueprint.route('/delete/<idUsuario>', methods=['GET'])
def delete_user(idUsuario):
    # Llamar a la función para eliminar un usuario
    user = mu.delete_user(idUsuario)
    if user == -1:
        return json.dumps({'error': 'No se pudo borrar el usuario'})
    return json.dumps(user.to_dict())

