# Importación de módulos necesarios para definir columnas y tipos de datos
from sqlalchemy import Column, Integer, String, DECIMAL, Text
from alchemyClasses import db  # Importación del objeto de base de datos desde alchemyClasses

# Clase Producto que representa la tabla 'Producto' en la base de datos
class Producto(db.Model):
    __tablename__ = 'Producto'  # Nombre de la tabla en la base de datos

    # Definición de las columnas de la tabla
    idProducto = Column(Integer, primary_key=True)  # Llave primaria, identifica cada producto
    idUsuario = Column(Integer)  # Identificador del usuario propietario del producto
    nombreProducto = Column(String(50))  # Nombre del producto, con un límite de 50 caracteres
    descripcion = Column(Text)  # Descripción del producto, sin límite de tamaño específico
    foto = Column(String(255))  # Ruta o nombre del archivo de la imagen del producto (máximo 255 caracteres)
    precio = Column(DECIMAL(10, 2))  # Precio del producto, con dos decimales de precisión
    contacto = Column(Text)  # Información de contacto para el vendedor o proveedor
    cantidad = Column(Integer)  # Cantidad disponible en el inventario

    # Constructor de la clase para inicializar los atributos
    def __init__(self, idUsuario, nombreProducto, descripcion, foto, precio, contacto, cantidad):
        self.idUsuario = idUsuario  # Usuario propietario del producto
        self.nombreProducto = nombreProducto  # Nombre del producto
        self.descripcion = descripcion  # Descripción del producto
        self.foto = foto  # Imagen asociada al producto
        self.precio = precio  # Precio del producto
        self.contacto = contacto  # Información de contacto para el producto
        self.cantidad = cantidad  # Cantidad disponible en inventario

    # Representación como cadena, útil para depuración
    def __str__(self):
        return (f'Producto: {self.nombreProducto} (ID: {self.idProducto}), '
                f'Descripción: {self.descripcion}, Precio: {self.precio}, '
                f'Contacto: {self.contacto}, Cantidad: {self.cantidad}')

    # Método para convertir la instancia en un diccionario (útil para API REST o serialización)
    def to_dict(self):
        return {
            'idProducto': self.idProducto,  # ID único del producto
            'idUsuario': self.idUsuario,  # ID del usuario propietario
            'nombreProducto': self.nombreProducto,  # Nombre del producto
            'descripcion': self.descripcion,  # Descripción del producto
            'foto': self.foto,  # Ruta o nombre de la imagen del producto
            'precio': float(self.precio),  # Precio del producto (convertido a float)
            'contacto': self.contacto,  # Información de contacto
            'cantidad': self.cantidad  # Cantidad disponible en inventario
        }

