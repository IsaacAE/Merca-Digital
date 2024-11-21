from alchemyClasses.Compra import Compra
from alchemyClasses.Contener import Contener
from alchemyClasses.Producto import Producto
from alchemyClasses import db
from flask import jsonify


def create_compra(idUsuario, total, fecha):
    new_compra = Compra(idUsuario=idUsuario, total=total, fecha=fecha)
    try:
        db.session.add(new_compra)
        db.session.commit()
        return new_compra
    except Exception as e:
        print(e)
        return -1


def get_compras(idUsuario):
    compras = Compra.query.filter_by(idUsuario=idUsuario).all()
    return compras


def get_compras_con_productos(idUsuario):
    try:
        # Realizar un join entre las tablas Compra, Contener y Producto
        compras_con_detalles = db.session.query(Compra, Contener, Producto)\
            .join(Contener, Compra.idCompra == Contener.idCompra)\
            .join(Producto, Contener.idProducto == Producto.idProducto)\
            .filter(Compra.idUsuario == idUsuario)\
            .all()

        # Crear un diccionario para almacenar las compras y sus productos asociados
        compras_dict = {}
        for compra, contener, producto in compras_con_detalles:
            if compra.idCompra not in compras_dict:
                compras_dict[compra.idCompra] = {
                    'idCompra': compra.idCompra,
                    'idUsuario': compra.idUsuario,
                    'total': compra.total,
                    'fecha': compra.fecha,
                    'productos': []
                }
            compras_dict[compra.idCompra]['productos'].append({
                'idProducto': producto.idProducto,
                'nombreProducto': producto.nombreProducto,
                'descripcion': producto.descripcion,
                'foto': producto.foto,
                'idVendedor': producto.idUsuario,
                'cantidad': contener.cantidad,
                'importe': contener.importe,
                'calificacion': contener.calificacion,
                'comentario': contener.comentario
            })

        # Convertir el diccionario en una lista de compras
        compras_list = list(compras_dict.values())

        return jsonify(compras_list)
    except Exception as e:
        print(e)
        return -1

    