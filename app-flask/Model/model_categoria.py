# Importación de clases y módulos necesarios
from alchemyClasses.Categoria import Categoria  # Clase que representa la tabla 'Categoria'
from alchemyClasses import db  # Objeto de base de datos
from flask import jsonify  # Para crear respuestas JSON

# CRUD para manejar las categorías

# Función para crear una nueva categoría para un producto
def create_categoria(idProducto, categoria):
    """
    Crea una nueva categoría para un producto.
    """
    # Crea un nuevo objeto Categoria con el id del producto y la categoría
    new_category = Categoria(idProducto=idProducto, categoria=categoria)
    try:
        # Intenta agregar la nueva categoría a la base de datos
        db.session.add(new_category)
        db.session.commit()  # Guarda los cambios en la base de datos
        return new_category  # Devuelve la categoría creada
    except:
        return -1  # Si ocurre un error, devuelve -1

# Función para obtener todas las categorías de un producto
def categorias_de_producto(idProducto):
    """
    Obtiene todas las categorías asociadas a un producto específico.
    """
    # Consulta todas las categorías asociadas al idProducto
    categorias = Categoria.query.filter_by(idProducto=idProducto).all()
    return categorias  # Devuelve una lista de categorías

# Función para eliminar una categoría específica de un producto
def delete_categoria(idProducto, categoria):
    """
    Elimina una categoría específica de un producto.
    """
    try:
        # Busca la categoría específica por idProducto y nombre de la categoría
        categoria = Categoria.query.filter_by(idProducto=idProducto, categoria=categoria).first()
        # Si la categoría existe, la elimina
        db.session.delete(categoria)
        db.session.commit()  # Guarda los cambios
    except:
        return -1  # Si ocurre un error, devuelve -1

# Función para eliminar todas las categorías asociadas a un producto
def delete_categorias(idProducto):
    """
    Elimina todas las categorías asociadas a un producto.
    """
    try:
        print(idProducto)  # Imprime el id del producto para depuración
        # Obtiene todas las categorías asociadas al producto
        categorias = Categoria.query.filter_by(idProducto=idProducto).all()
        # Elimina todas las categorías asociadas al producto
        for categoria in categorias:
            db.session.delete(categoria)
            db.session.commit()  # Guarda los cambios
    except:
        return -1  # Si ocurre un error, devuelve -1

