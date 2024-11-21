from sqlalchemy import Column, Integer, String, LargeBinary, DECIMAL, Text
from alchemyClasses import db

class Producto(db.Model):
    __tablename__ = 'Producto'
    idProducto = Column(Integer, primary_key=True)
    idUsuario = Column(Integer)
    nombreProducto = Column(String(50))
    descripcion = Column(Text)
    foto = Column(String(255))
    precio = Column(DECIMAL(10, 2))
    contacto = Column(Text)
    cantidad = Column(Integer)

    def __init__(self, idUsuario, nombreProducto, descripcion, foto, precio, contacto, cantidad):
        self.idUsuario = idUsuario
        self.nombreProducto = nombreProducto
        self.descripcion = descripcion
        self.foto = foto
        self.precio = precio
        self.contacto = contacto
        self.cantidad = cantidad

    def __str__(self):
        return f'Producto: {self.nombreProducto} (ID: {self.idProducto}), Descripción: {self.descripcion}, Precio: {self.precio}, Contacto: {self.contacto}, Cantidad: {self.cantidad}'

    def to_dict(self):
        return {
            'idProducto': self.idProducto,
            'idUsuario': self.idUsuario,
            'nombreProducto': self.nombreProducto,
            'descripcion': self.descripcion,
            'foto': self.foto,
            'precio': float(self.precio),
            'contacto': self.contacto,
            'cantidad': self.cantidad
        }
