from sqlalchemy import Column, Integer, String, LargeBinary
from alchemyClasses import db

class Usuario(db.Model):
    __tablename__ = 'Usuario'
    idUsuario = Column(Integer, primary_key=True)
    nombre = Column(String(50), nullable=False)
    apPat = Column(String(50), nullable=False)
    apMat = Column(String(50), nullable=False)
    correo = Column(String(50), nullable=False)
    telefono = Column(String(10), nullable=False)
    contraseña = Column(String(50), nullable=False)
    imagen = Column(String(50))
    vendedor = Column(Integer, nullable=False)
    
    def _init_(self, nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor):
        self.nombre = nombre
        self.apPat = apPat
        self.apMat = apMat
        self.correo = correo
        self.telefono = telefono
        self.contraseña = contraseña
        self.imagen = imagen
        self.vendedor = vendedor
        
    def _str_(self):
        return f'Usuario: {self.nombre} {self.apPat} {self.apMat} {self.correo} {self.telefono} {self.contraseña} {self.imagen} {self.vendedor}'
    
    
    def to_dict(self):
        return {
            'idUsuario': self.idUsuario,
            'nombre': self.nombre,
            'apPat': self.apPat,
            'apMat': self.apMat,
            'correo': self.correo,
            'telefono': self.telefono,
            'imagen': self.imagen,
            'vendedor': self.vendedor
        }