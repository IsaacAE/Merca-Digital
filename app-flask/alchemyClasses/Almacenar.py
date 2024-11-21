from sqlalchemy import Column, Integer, ForeignKey
from alchemyClasses import db

class Almacenar(db.Model):
    __tablename__ = 'Almacenar'
    idAlmacenar=Column(Integer, primary_key=True)
    idCarrito = Column(Integer, ForeignKey('Tener.idCarrito'))
    idProducto=Column(Integer, ForeignKey('Producto.idProducto'))
    cantidad = Column(Integer)
    
    
    def __init__(self, idCarrito, idProducto, cantidad):
        self.idCarrito = idCarrito
        self.idProducto = idProducto
        self.cantidad = cantidad
    
    def __str__(self):
        return f'Carrito: {self.idCarrito}, Producto: {self.idProducto}, Cantidad: {self.cantidad}'
    
    def to_dict(self):
        return {
            'idCarrito': self.idCarrito,
            'idProducto': self.idProducto,
            'cantidad': self.cantidad
        }
    
    def _str_(self):
        return f'Usuario: {self.nombre} {self.apPat} {self.apMat} {self.correo} {self.telefono} {self.contraseña} {self.imagen} {self.vendedor}, Carrito: {self.idCarrito}'