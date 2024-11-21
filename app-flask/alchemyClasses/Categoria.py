from sqlalchemy import Column, Integer, String, LargeBinary, ForeignKey
from alchemyClasses import db

class Categoria(db.Model):
    __tablename__ = 'Categoria'
    idCategoria = Column(Integer, primary_key=True)
    idProducto = Column(Integer, ForeignKey('Producto.idProducto'))
    categoria = Column(String(255))
    
    producto = db.relationship("Producto", backref="Categoria", single_parent=True)
    
    def _init_(self, idProducto, categoria):
        self.idProducto = idProducto
        self.categoria = categoria
    
    def _str_(self):
        return f'Producto: {self.idProducto} Categoria: {self.categoria}'
        
    def to_dict(self):
        return {
            'idProducto': self.idProducto,
            'categoria': self.categoria
        }
