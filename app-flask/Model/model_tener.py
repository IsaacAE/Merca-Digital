# Importación de las clases necesarias
from alchemyClasses.Tener import Tener  # Clase que representa la tabla 'Tener'
from alchemyClasses import db  # Objeto de la base de datos
from flask import jsonify  # Para crear respuestas JSON

# Crear un nuevo carrito (Tener)
def create_tener(idUsuario, nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor):
    """
    Crea un nuevo registro en la tabla 'Tener', que representa el carrito de compras de un usuario.
    """
    new_tener = Tener(idUsuario=idUsuario, nombre=nombre, apPat=apPat, apMat=apMat, correo=correo, telefono=telefono, contraseña=contraseña, imagen=imagen, vendedor=vendedor)
    try:
        db.session.add(new_tener)  # Agrega el nuevo carrito a la sesión de la base de datos
        db.session.commit()  # Guarda los cambios
        return new_tener  # Devuelve el nuevo carrito creado
    except:
        return -1  # Retorna -1 en caso de error

# Buscar un carrito por el ID del usuario (idUsuario)
def find_tener_by_idUsuario(idUsuario):
    """
    Busca un carrito de compras asociada a un usuario específico por su idUsuario.
    """
    tener = Tener.query.filter(Tener.idComprador == idUsuario).first()  # Busca el carrito del usuario
    if tener is None:
        print('El usuario con id: ' + str(idUsuario) + ' no tiene un carrito')  # Si no existe, muestra un mensaje
        return -1  # Retorna -1 si no encuentra el carrito
    return tener  # Devuelve el carrito encontrado

# Buscar un carrito por el ID del carrito (idCarrito)
def find_tener_by_idCarrito(idCarrito):
    """
    Busca un carrito de compras por su idCarrito.
    """
    tener = Tener.query.filter(Tener.idCarrito == idCarrito).first()  # Busca el carrito por su ID
    if tener is None:
        print('El carrito con id: ' + str(idCarrito) + ' no existe')  # Si no existe, muestra un mensaje
        return -1  # Retorna -1 si no encuentra el carrito
    return tener  # Devuelve el carrito encontrado

# Obtener todos los carritos de compras
def read_tener():
    """
    Obtiene todos los carritos de compras de la base de datos.
    """
    return Tener.query.all()  # Retorna todos los registros en la tabla 'Tener'

