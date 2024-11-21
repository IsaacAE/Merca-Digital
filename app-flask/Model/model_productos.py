from alchemyClasses.Producto import Producto
from alchemyClasses.Usuario import Usuario
from alchemyClasses import db
from flask import jsonify
from alchemyClasses.Categoria import Categoria

# CRUD para productos

def create_product(idUsuario, nombreProducto, descripcion, foto, precio, contacto, cantidad):
    new_producto = Producto(idUsuario=idUsuario, nombreProducto=nombreProducto, descripcion=descripcion, foto=foto, precio=precio, contacto=contacto, cantidad=cantidad)
    try:
        db.session.add(new_producto)
        db.session.commit()
        return new_producto
    except Exception as e:
        print(e)
        return -1
    
def read_product(idProducto):
    producto = Producto.query.get(idProducto)
    if producto is None:
        print('El producto con id: '+str(idProducto)+' no existe')
        return -1
    return producto

def read_product_email(idProducto):
    producto = Producto.query.get(idProducto)
    if producto is None:
        print('El producto con id: '+str(idProducto)+' no existe')
        return -1
    return producto.contacto

def get_email_seller(idProducto):
  
    producto = Producto.query.filter_by(idProducto=idProducto).first()
    
    if not producto:
        return None  #
    
    
    usuario = Usuario.query.filter_by(idUsuario=producto.idUsuario).first()
    
    if not usuario:
        return None  
    
    return usuario.correo

def check_contact(correo,idProducto):
    producto = read_product(idProducto)
    usuario = Usuario.query.filter_by(correo=correo).first()
    if(usuario.idUsuario==producto.idUsuario):
        return True
    return False
    


def read_products():
    return Producto.query.all()

def read_products_vendor(idVendedor):
    try:
        productos = Producto.query.filter_by(idUsuario=idVendedor).all()
        print(productos)
        return productos
    except Exception as e:
        print("Ocurrió un error al intentar obtener los productos del vendedor: ", e)
        return -1


def update_product(idProducto, idUsuario, nombreProducto, descripcion, foto, precio, contacto, cantidad):
    producto = Producto.query.get(idProducto)
    if producto is None:
        print('El producto con id: '+str(idProducto)+' no existe')
        return -1
    elif producto.idUsuario != int(idUsuario):
        print('El producto con id: '+str(idProducto)+' no pertenece al usuario con id: '+str(idUsuario))
        return -2
    else:
       if idUsuario:
           producto.idUsuario = idUsuario
       if nombreProducto:
            producto.nombreProducto = nombreProducto
       if descripcion:
            producto.descripcion = descripcion
       if foto:
            producto.foto = foto
       if precio:
            producto.precio = precio
       if contacto:
            producto.contacto = contacto
       if cantidad:
            producto.cantidad = cantidad
    db.session.commit()
    return producto


def delete_product(idProducto):
    producto = Producto.query.get(idProducto)
    if producto is None:
        print('El producto con id: '+str(idProducto)+' no existe')
        return -1
    db.session.delete(producto)
    db.session.commit()
    return producto

def productos_por_categoria(categoria):
    try:
        productos = Producto.query.join(Categoria, Producto.idProducto == Categoria.idProducto).filter(Categoria.categoria == categoria).all()
        return productos
    except Exception as e:
        print("Ocurrió un error al intentar obtener los productos por categoría: ", e)
        return -1

def products_by_name(string):
    try:
        productos = Producto.query.filter(Producto.nombreProducto.ilike(f"%{string}%")).all()
        return productos
    except Exception as e:
        print("Ocurrió un error al intentar obtener los productos por nombre: ", e)
        return -1

def products_by_check(nombre, categoria, min_price, max_price):
    try:
        query = Producto.query
        
        # Aplicar filtro de precio
        query = query.filter(Producto.precio >= min_price, Producto.precio <= max_price)
        
        # Aplicar filtro de nombre si no está vacío
        if nombre:
           query = query.filter(Producto.nombreProducto.ilike(f"%{nombre}%"))
        
        
        # Aplicar filtro de categoría si no está vacío
        if categoria:
           query = query.join(Categoria, Producto.idProducto == Categoria.idProducto).filter(Categoria.categoria == categoria.strip())
        
        # Ejecutar la consulta y obtener los resultados
        productos = query.all()
        return productos
    except Exception as e:
        print("Ocurrió un error al intentar obtener los productos: ", e)
        return -1




def get_product_image(idProducto):
    producto = Producto.query.get(idProducto)
    if producto is None:
        print('El producto con id: '+str(idProducto)+' no existe')
        return -1
    nombre_imagen= producto.foto
    return nombre_imagen

def get_verification(idProducto, idUsuario):
    producto = Producto.query.get(idProducto)
    if producto is None:
        print('El producto con id: '+str(idProducto)+' no existe')
        return -1
    elif producto.idUsuario != int(idUsuario):
        print('El producto con id: '+str(idProducto)+' no pertenece al usuario con id: '+str(idUsuario))
        return -2
    else:
        return True
    
def reactivate_product(idProducto):
    product = Producto.query.get(idProducto)
    if product is None:
        print('El producto con id: ' + str(idProducto) + ' no existe')
        return -1
    else:
        product.cantidad = 1  # Esto establecerá el stock en 1 cuando se reactive el producto
    db.session.commit()
    return product
