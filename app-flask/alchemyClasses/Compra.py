from sqlalchemy import Column, Integer, String, LargeBinary, ForeignKey, Float, Date
from alchemyClasses import db

class Compra(db.Model):
    __tablename__ = 'Compra'
    idCompra = Column(Integer, primary_key=True)
    idUsuario = Column(Integer, ForeignKey('Usuario.idUsuario'))
    total = Column(Float)
    fecha = Column(Date)
    
    def __init__(self, idUsuario, total, fecha):
        self.idUsuario = idUsuario
        self.total = total
        self.fecha = fecha
        
    def __str__(self):
        return f'Compra: {self.idCompra}, usuario: {self.idUsuario}, total: {self.total}, fecha: {self.fecha}'
    
    def to_dict(self):
        return {
            'idCompra': self.idCompra,
            'idUsuario': self.idUsuario,
            'total': self.total,
            'fecha': self.fecha.isoformat() if self.fecha else None 
        }