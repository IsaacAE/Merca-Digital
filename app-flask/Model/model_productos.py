# Importación de clases y módulos necesarios
from alchemyClasses.Producto import Producto  # Clase que representa la tabla 'Producto'
from alchemyClasses.Usuario import Usuario  # Clase que representa la tabla 'Usuario'
from alchemyClasses import db  # Objeto de base de datos
from flask import jsonify  # Para crear respuestas JSON
from alchemyClasses.Categoria import Categoria  # Clase que representa la tabla 'Categoria'

# CRUD para productos

# Crear un nuevo producto
def create_product(idUsuario, nombreProducto, descripcion, foto, precio, contacto, cantidad):
    """
    Crea un nuevo producto en la base de datos.
    """
    new_producto = Producto(idUsuario=idUsuario, nombreProducto=nombreProducto, descripcion=descripcion, foto=foto, precio=precio, contacto=contacto, cantidad=cantidad)
    try:
        db.session.add(new_producto)  # Agrega el nuevo producto a la sesión de la base de datos
        db.session.commit()  # Guarda los cambios
        return new_producto  # Devuelve el nuevo producto creado
    except Exception as e:
        print(e)  # Imprime el error si ocurre
        return -1  # Retorna -1 en caso de error

# Leer un producto por su ID
def read_product(idProducto):
    """
    Obtiene un producto por su ID.
    """
    producto = Producto.query.get(idProducto)  # Busca el producto por ID
    if producto is None:
        print('El producto con id: '+str(idProducto)+' no existe')  # Si no lo encuentra, muestra un mensaje
        return -1  # Devuelve -1 si no encuentra el producto
    return producto  # Si lo encuentra, lo devuelve

# Leer el correo del vendedor de un producto
def read_product_email(idProducto):
    """
    Obtiene el contacto del vendedor de un producto.
    """
    producto = Producto.query.get(idProducto)  # Busca el producto por ID
    if producto is None:
        print('El producto con id: '+str(idProducto)+' no existe')  # Si no lo encuentra, muestra un mensaje
        return -1  # Devuelve -1 si no encuentra el producto
    return producto.contacto  # Devuelve el contacto del vendedor

# Obtener el correo del vendedor del producto
def get_email_seller(idProducto):
    """
    Obtiene el correo del vendedor de un producto.
    """
    producto = Producto.query.filter_by(idProducto=idProducto).first()  # Busca el producto
    if not producto:
        return None  # Si no lo encuentra, retorna None
    
    usuario = Usuario.query.filter_by(idUsuario=producto.idUsuario).first()  # Obtiene al usuario (vendedor)
    if not usuario:
        return None  # Si no encuentra el vendedor, retorna None
    
    return usuario.correo  # Devuelve el correo del vendedor

# Verificar si el correo del usuario coincide con el vendedor del producto
def check_contact(correo, idProducto):
    """
    Verifica si el correo pertenece al vendedor del producto.
    """
    producto = read_product(idProducto)  # Obtiene el producto
    usuario = Usuario.query.filter_by(correo=correo).first()  # Obtiene el usuario por correo
    if usuario.idUsuario == producto.idUsuario:  # Si el usuario es el vendedor
        return True
    return False  # Si no es el vendedor, retorna False

# Leer todos los productos
def read_products():
    """
    Obtiene todos los productos de la base de datos.
    """
    return Producto.query.all()  # Retorna todos los productos

# Leer productos de un vendedor específico
def read_products_vendor(idVendedor):
    """
    Obtiene todos los productos de un vendedor específico.
    """
    try:
        productos = Producto.query.filter_by(idUsuario=idVendedor).all()  # Busca los productos del vendedor
        print(productos)  # Imprime los productos
        return productos  # Devuelve los productos
    except Exception as e:
        print("Ocurrió un error al intentar obtener los productos del vendedor: ", e)
        return -1  # Retorna -1 en caso de error

# Actualizar un producto existente
def update_product(idProducto, idUsuario, nombreProducto, descripcion, foto, precio, contacto, cantidad):
    """
    Actualiza los detalles de un producto específico.
    """
    producto = Producto.query.get(idProducto)  # Busca el producto por ID
    if producto is None:
        print('El producto con id: '+str(idProducto)+' no existe')  # Si no lo encuentra, muestra un mensaje
        return -1  # Retorna -1 si no encuentra el producto
    elif producto.idUsuario != int(idUsuario):
        print('El producto con id: '+str(idProducto)+' no pertenece al usuario con id: '+str(idUsuario))  # Verifica si el usuario es el dueño del producto
        return -2  # Retorna -2 si el usuario no es el dueño
    else:
        # Actualiza los campos del producto si están presentes
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
    db.session.commit()  # Guarda los cambios
    return producto  # Devuelve el producto actualizado

# Eliminar un producto
def delete_product(idProducto):
    """
    Elimina un producto de la base de datos.
    """
    producto = Producto.query.get(idProducto)  # Busca el producto por ID
    if producto is None:
        print('El producto con id: '+str(idProducto)+' no existe')  # Si no lo encuentra, muestra un mensaje
        return -1  # Retorna -1 si no encuentra el producto
    db.session.delete(producto)  # Elimina el producto de la base de datos
    db.session.commit()  # Guarda los cambios
    return producto  # Devuelve el producto eliminado

# Obtener productos por categoría
def productos_por_categoria(categoria):
    """
    Obtiene los productos que pertenecen a una categoría específica.
    """
    try:
        productos = Producto.query.join(Categoria, Producto.idProducto == Categoria.idProducto).filter(Categoria.categoria == categoria).all()  # Realiza un JOIN entre Producto y Categoria
        return productos  # Devuelve los productos de esa categoría
    except Exception as e:
        print("Ocurrió un error al intentar obtener los productos por categoría: ", e)
        return -1  # Retorna -1 en caso de error

# Buscar productos por nombre
def products_by_name(string):
    """
    Busca productos cuyo nombre contenga un string específico.
    """
    try:
        productos = Producto.query.filter(Producto.nombreProducto.ilike(f"%{string}%")).all()  # Realiza una búsqueda insensible a mayúsculas
        return productos  # Devuelve los productos encontrados
    except Exception as e:
        print("Ocurrió un error al intentar obtener los productos por nombre: ", e)
        return -1  # Retorna -1 en caso de error

# Filtros avanzados para buscar productos
def products_by_check(nombre, categoria, min_price, max_price):
    """
    Busca productos con filtros aplicados de nombre, categoría y precio.
    """
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
        
        productos = query.all()  # Ejecuta la consulta y obtiene los resultados
        return productos  # Devuelve los productos encontrados
    except Exception as e:
        print("Ocurrió un error al intentar obtener los productos: ", e)
        return -1  # Retorna -1 en caso de error

# Obtener la imagen de un producto
def get_product_image(idProducto):
    """
    Obtiene el nombre de la imagen asociada a un producto.
    """
    producto = Producto.query.get(idProducto)  # Busca el producto por ID
    if producto is None:
        print('El producto con id: '+str(idProducto)+' no existe')  # Si no lo encuentra, muestra un mensaje
        return -1  # Retorna -1 si no encuentra el producto
    nombre_imagen = producto.foto  # Obtiene el nombre de la imagen
    return nombre_imagen  # Devuelve el nombre de la imagen

# Verificar si el usuario tiene acceso a modificar un producto
def get_verification(idProducto, idUsuario):
    """
    Verifica si el usuario tiene permiso para modificar un producto.
    """
    producto = Producto.query.get(idProducto)  # Busca el producto por ID
    if producto is None:
        print('El producto con id: '+str(idProducto)+' no existe')  # Si no lo encuentra, muestra un mensaje
        return -1  # Retorna -1 si no encuentra el producto
    elif producto.idUsuario != int(idUsuario):
        print('El producto con id: '+str(idProducto)+' no pertenece al usuario con id: '+str(idUsuario))  # Verifica si el usuario es el dueño
        return -2  # Retorna -2 si el usuario no es el dueño
    else:
        return True  # Si es el dueño, retorna True

# Reactivar un producto
def reactivate_product(idProducto):
    """
    Reactiva un producto (lo establece en stock).
    """
    product = Producto.query.get(idProducto)  # Busca el producto por ID
    if product is None:
        print('El producto con id: ' + str(idProducto) + ' no existe')  # Si no lo encuentra, muestra un mensaje
        return -1  # Retorna -1 si no encuentra el producto
    else:
        product.cantidad = 1  # Reactiva el producto (restablece el stock a 1)
    db.session.commit()  # Guarda los cambios
    return product  # Devuelve el producto reactivado

