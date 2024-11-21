from sqlalchemy import Column, Integer, String, LargeBinary, ForeignKey
from alchemyClasses import db

class Tener(db.Model):
    __tablename__ = 'Tener'
    idCarrito = Column(Integer, primary_key=True)
    idComprador = Column(Integer, ForeignKey('Usuario.idUsuario'))
    nombre = Column(String(50))
    apPat = Column(String(50))
    apMat = Column(String(50))
    correo = Column(String(50))
    telefono = Column(String(10))
    contraseña = Column(String(50))
    imagen = Column(String(50))
    vendedor = Column(Integer, nullable=False)
    
    def _init_(self, idComprador, nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor):
        self.idComprador = idComprador
        self.nombre = nombre
        self.apPat = apPat
        self.apMat = apMat
        self.correo = correo
        self.telefono = telefono
        self.contraseña = contraseña
        self.imagen = imagen
        self.vendedor = vendedor
    
    def _str_(self):
        return f'Usuario: {self.nombre} {self.apPat} {self.apMat} {self.correo} {self.telefono} {self.contraseña} {self.imagen} {self.vendedor}, Carrito: {self.idCarrito}'
        
    def to_dict(self):
        return {
            'idCarrito': self.idCarrito,
            'idComprador': self.idComprador,
            'nombre': self.nombre,
            'apPat': self.apPat,
            'apMat': self.apMat,
            'correo': self.correo,
            'telefono': self.telefono,
            'contraseña': self.contraseña,
            'imagen': self.imagen,
            'vendedor': self.vendedor
        }