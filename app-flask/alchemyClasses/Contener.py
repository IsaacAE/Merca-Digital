from sqlalchemy import Column, Integer, String, LargeBinary, ForeignKey, Float, Date, Text
from alchemyClasses import db

class Contener(db.Model):
    __tablename__ = 'Contener'
    idContener = Column(Integer, primary_key=True)
    idCompra = Column(Integer, ForeignKey('Compra.idCompra'))
    idProducto = Column(Integer, ForeignKey('Producto.idProducto'))
    cantidad = Column(Integer)
    importe = Column(Float)
    calificacion = Column(Integer)
    comentario = Column(Text)
    
    
    
    def __init__(self, idCompra, idProducto, cantidad, importe, calificacion=None, comentario=None):
        self.idCompra = idCompra
        self.idProducto = idProducto
        self.cantidad = cantidad
        self.importe = importe
        self.calificacion = calificacion
        self.comentario = comentario
        
    def __str__(self):
        return f'Compra: {self.idCompra}, producto: {self.idProducto}, cantidad: {self.cantidad}, importe: {self.importe}, calificacion: {self.calificacion}, comentario: {self.comentario}'
    
    def to_dict(self):
        return {
            'idContener': self.idContener,
            'idCompra': self.idCompra,
            'idProducto': self.idProducto,
            'cantidad': self.cantidad,
            'importe': self.importe,
            'calificacion': self.calificacion,
            'comentario': self.comentario
        }