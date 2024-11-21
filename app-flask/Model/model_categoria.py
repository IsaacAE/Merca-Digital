from alchemyClasses.Categoria import Categoria
from alchemyClasses import db
from flask import jsonify

#CRUD

def create_categoria(idProducto, categoria):
    new_category = Categoria(idProducto=idProducto, categoria=categoria)
    try:
        db.session.add(new_category)
        db.session.commit()
        return new_category
    except:
        return -1

# Obtiene todas las categorias de un producto
def categorias_de_producto(idProducto):
    categorias = Categoria.query.filter_by(idProducto=idProducto).all()
    return categorias

def delete_categoria(idProducto, categoria):
    try:
        categoria = Categoria.query.filter_by(idProducto=idProducto, categoria=categoria).first()
        db.session.delete(categoria)
        db.session.commit()
    except:
        return -1
    
def delete_categorias(idProducto):
    try:
        print(idProducto)
        categorias = Categoria.query.filter_by(idProducto=idProducto).all()
        for categoria in categorias:
            db.session.delete(categoria)
            db.session.commit()
    except:
        return -1
    
    
    

