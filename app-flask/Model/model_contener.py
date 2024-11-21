from alchemyClasses.Contener import Contener
from alchemyClasses.Compra import Compra
from alchemyClasses import db
from flask import jsonify


def agregarProducto(idCompra, idProducto, cantidad, importe):
    new_contener = Contener(idCompra=idCompra, idProducto=idProducto, cantidad=cantidad, importe=importe)
    try:
        db.session.add(new_contener)
        db.session.commit()
        return new_contener
    except Exception as e:
        print(e)
        return -1
    
def get_productos_de_compra(idCompra):
    contener = Contener.query.filter_by(idCompra=idCompra).all()
    return contener

def get_productos_de_usuario(idUsuario):
    contener = Contener.query.join(Compra).filter(Compra.idUsuario == idUsuario).all()
    return contener

def revisar_existencia(idProducto):
    prod = Contener.query.filter(Contener.idProducto == idProducto).first()
    if prod: 
       return True
    else:
       return False

def agregar_calificacion(idCompra, idProducto, calificacion):
    contener = Contener.query.filter_by(idCompra=idCompra, idProducto=idProducto).first()
    contener.calificacion = calificacion
    db.session.commit()
    return contener

def agregar_comentario(idCompra, idProducto, comentario):
    contener = Contener.query.filter_by(idCompra=idCompra, idProducto=idProducto).first()
    contener.comentario = comentario
    db.session.commit()
    return contener

# Función para actualizar comentario y calificación
def actualizar_comentario_y_calificacion(idCompra, idProducto, comentario, calificacion):
    contener = Contener.query.filter_by(idCompra=idCompra, idProducto=idProducto).first()
    if contener:
        contener.comentario = comentario
        contener.calificacion = calificacion
        db.session.commit()
        return contener
    else:
        return -1
    
def obtener_opiniones(idProducto):
    contener = Contener.query.filter(Contener.calificacion >=0, Contener.idProducto==idProducto).all()
    return contener
    
    
    
