from alchemyClasses.Tener import Tener
from alchemyClasses import db
from flask import jsonify


def create_tener(idUsuario, nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor):
    new_tener = Tener(idUsuario=idUsuario, nombre=nombre, apPat=apPat, apMat=apMat, correo=correo, telefono=telefono, contraseña=contraseña, imagen=imagen, vendedor=vendedor)
    try:
        db.session.add(new_tener)
        db.session.commit()
        return new_tener
    except:
        return -1

def find_tener_by_idUsuario(idUsuario):
    tener = Tener.query.filter(Tener.idComprador == idUsuario).first()
    if tener is None:
        print('El usuario con id: ' + str(idUsuario) + ' no tiene un carrito')
        return -1
    return tener
    
def find_tener_by_idCarrito(idCarrito):
    tener = Tener.query.filter(Tener.idCarrito == idCarrito).first()
    if tener is None:
        print('El carrito con id: ' + str(idCarrito) + ' no existe')
        return -1
    return tener

def read_tener():
    return Tener.query.all()
