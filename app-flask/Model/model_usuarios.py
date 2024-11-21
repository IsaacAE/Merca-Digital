from alchemyClasses.Usuario import Usuario  # Importa la clase Usuario
from alchemyClasses import db  # Objeto de la base de datos
from flask import jsonify  # Para generar respuestas JSON

# Crear un nuevo usuario
def create_user(nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor):
    """
    Crea un nuevo usuario en la base de datos si no existe un usuario con el mismo correo.
    """
    user = Usuario.query.filter_by(correo=correo).first()  # Verifica si el correo ya existe
    if user:  # Si el usuario ya existe, retorna un código de error -2
        return -2
    new_user = Usuario(nombre=nombre, apPat=apPat, apMat=apMat, correo=correo, telefono=telefono, contraseña=contraseña, imagen=imagen, vendedor=vendedor)
    try:
        db.session.add(new_user)  # Agrega el nuevo usuario a la sesión de la base de datos
        db.session.commit()  # Guarda los cambios
        return new_user  # Devuelve el nuevo usuario
    except:
        return -1  # Retorna -1 si ocurre un error

# Buscar usuario por correo y contraseña
def find_user_by_email_and_password(correo, contraseña):
    """
    Busca un usuario por correo y contraseña. Retorna el usuario si la autenticación es exitosa.
    """
    user = Usuario.query.filter(Usuario.correo == correo).first()  # Busca al usuario por correo
    if user is None:
        print('El usuario con correo: ' + correo + ' no existe')
        return -1  # Si no existe el usuario, retorna -1
    elif user.contraseña != contraseña:  # Si la contraseña no coincide
        print('La contraseña para el usuario con correo: ' + correo + ' es incorrecta')
        return -2  # Retorna -2 si la contraseña es incorrecta
    return user  # Retorna el usuario si la autenticación es correcta

# Leer usuario por ID
def read_user(idUsuario):
    """
    Busca un usuario por su ID.
    """
    user = Usuario.query.filter(Usuario.idUsuario == idUsuario).first()  # Busca al usuario por su ID
    if user is None:
        print('El usuario con id: ' + str(idUsuario) + ' no existe')
        return -1  # Si no existe, retorna -1
    return user  # Retorna el usuario encontrado

# Leer todos los usuarios
def read_users():
    """
    Devuelve todos los usuarios de la base de datos.
    """
    return Usuario.query.all()  # Devuelve todos los registros de la tabla Usuario

# Actualizar los detalles del usuario
def update_user(idUsuario, nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor):
    """
    Actualiza los detalles de un usuario. Requiere su ID.
    """
    user = Usuario.query.filter_by(idUsuario=idUsuario).first()  # Busca el usuario por su ID
    if user is None:
        print('El usuario con id: ' + str(idUsuario) + ' no existe')
        return -1  # Si no existe, retorna -1
    # Actualiza los campos con los nuevos valores
    user.nombre = nombre
    user.apPat = apPat
    user.apMat = apMat
    user.correo = correo
    user.telefono = telefono
    user.contraseña = contraseña
    user.imagen = imagen
    user.vendedor = vendedor
    db.session.commit()  # Guarda los cambios
    return user  # Retorna el usuario actualizado

# Funciones específicas para actualizar un solo campo:
def update_nombre(idUsuario, nombre):
    """
    Actualiza solo el nombre de un usuario.
    """
    user = Usuario.query.filter_by(idUsuario=idUsuario).first()
    if user is None:
        print('El usuario con id: ' + str(idUsuario) + ' no existe')
        return -1
    user.nombre = nombre
    db.session.commit()
    return user

def update_apPat(idUsuario, apellido):
    """
    Actualiza el apellido paterno de un usuario.
    """
    user = Usuario.query.filter_by(idUsuario=idUsuario).first()
    if user is None:
        print('El usuario con id: ' + str(idUsuario) + ' no existe')
        return -1
    user.apPat = apellido
    db.session.commit()
    return user

def update_apMat(idUsuario, apellido):
    """
    Actualiza el apellido materno de un usuario.
    """
    user = Usuario.query.filter_by(idUsuario=idUsuario).first()
    if user is None:
        print('El usuario con id: ' + str(idUsuario) + ' no existe')
        return -1
    user.apMat = apellido
    db.session.commit()
    return user

def update_correo(idUsuario, correo):
    """
    Actualiza el correo de un usuario. Verifica que el nuevo correo no esté duplicado.
    """
    check_user = Usuario.query.filter_by(correo=correo).first()
    if check_user:  # Si el correo ya existe
        print("se halla duplicado")
        return -2  # Retorna un código de error -2 si el correo ya está en uso
    user = Usuario.query.filter_by(idUsuario=idUsuario).first()
    if user is None:
        print('El usuario con id: ' + str(idUsuario) + ' no existe')
        return -1
    user.correo = correo
    db.session.commit()
    return user

def update_telefono(idUsuario, telefono):
    """
    Actualiza el teléfono de un usuario.
    """
    user = Usuario.query.filter_by(idUsuario=idUsuario).first()
    if user is None:
        print('El usuario con id: ' + str(idUsuario) + ' no existe')
        return -1
    user.telefono = telefono
    db.session.commit()
    return user

def update_contraseña(idUsuario, contraseña):
    """
    Actualiza la contraseña de un usuario.
    """
    user = Usuario.query.filter_by(idUsuario=idUsuario).first()
    if user is None:
        print('El usuario con id: ' + str(idUsuario) + ' no existe')
        return -1
    user.contraseña = contraseña
    db.session.commit()
    return user

def update_imagen(idUsuario, imagen):
    """
    Actualiza la imagen de un usuario.
    """
    user = Usuario.query.filter_by(idUsuario=idUsuario).first()
    if user is None:
        print('El usuario con id: ' + str(idUsuario) + ' no existe')
        return -1
    user.imagen = imagen
    db.session.commit()
    return user

# Eliminar un usuario
def delete_user(idUsuario):
    """
    Elimina un usuario de la base de datos por su ID.
    """
    user = Usuario.query.filter_by(idUsuario=idUsuario).first()
    if user is None:
        print('El usuario con id: ' + str(idUsuario) + ' no existe')
        return -1  # Si no existe, retorna -1
    db.session.delete(user)  # Elimina el usuario
    db.session.commit()  # Guarda los cambios
    return user  # Retorna el usuario eliminado

