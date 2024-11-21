# Importación de módulos necesarios para definir la tabla y sus relaciones
from sqlalchemy import Column, Integer, String, ForeignKey
from alchemyClasses import db

# Clase Categoria que representa la tabla 'Categoria' en la base de datos
class Categoria(db.Model):
    __tablename__ = 'Categoria'  # Nombre de la tabla en la base de datos

    # Definición de las columnas de la tabla
    idCategoria = Column(Integer, primary_key=True)  # Llave primaria de la tabla
    idProducto = Column(Integer, ForeignKey('Producto.idProducto'))  # Llave foránea que referencia a la tabla 'Producto'
    categoria = Column(String(255))  # Columna que almacena el nombre de la categoría

    # Relación con la tabla Producto (establece una relación bidireccional)
    producto = db.relationship("Producto", backref="Categoria", single_parent=True)

    # Constructor de la clase para inicializar los atributos
    def __init__(self, idProducto, categoria):
        self.idProducto = idProducto
        self.categoria = categoria

    # Método especial para representar la clase como una cadena (útil para depuración)
    def __str__(self):
        return f'Producto: {self.idProducto} Categoria: {self.categoria}'

    # Método para convertir la instancia a un diccionario (útil para respuestas JSON)
    def to_dict(self):
        return {
            'idProducto': self.idProducto,
            'categoria': self.categoria
        }

