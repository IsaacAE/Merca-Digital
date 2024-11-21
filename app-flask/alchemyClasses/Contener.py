# Importación de módulos necesarios para definir columnas, tipos de datos y relaciones
from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text
from alchemyClasses import db

# Clase Contener que representa la tabla 'Contener' en la base de datos
class Contener(db.Model):
    __tablename__ = 'Contener'  # Nombre de la tabla en la base de datos

    # Definición de las columnas de la tabla
    idContener = Column(Integer, primary_key=True)  # Llave primaria de la tabla
    idCompra = Column(Integer, ForeignKey('Compra.idCompra'))  # Llave foránea que referencia a la tabla 'Compra'
    idProducto = Column(Integer, ForeignKey('Producto.idProducto'))  # Llave foránea que referencia a la tabla 'Producto'
    cantidad = Column(Integer)  # Cantidad del producto comprado
    importe = Column(Float)  # Importe total del producto en la compra
    calificacion = Column(Integer)  # Calificación opcional asignada al producto
    comentario = Column(Text)  # Comentario opcional sobre el producto

    # Constructor para inicializar los atributos de la clase
    def __init__(self, idCompra, idProducto, cantidad, importe, calificacion=None, comentario=None):
        self.idCompra = idCompra  # Identificador de la compra
        self.idProducto = idProducto  # Identificador del producto
        self.cantidad = cantidad  # Cantidad del producto comprado
        self.importe = importe  # Monto total correspondiente al producto
        self.calificacion = calificacion  # Calificación asignada (puede ser `None`)
        self.comentario = comentario  # Comentario sobre el producto (puede ser `None`)

    # Representación como texto, útil para depuración
    def __str__(self):
        return (f'Compra: {self.idCompra}, producto: {self.idProducto}, '
                f'cantidad: {self.cantidad}, importe: {self.importe}, '
                f'calificacion: {self.calificacion}, comentario: {self.comentario}')

    # Método para convertir la instancia a un diccionario, útil para respuestas JSON
    def to_dict(self):
        return {
            'idContener': self.idContener,  # Identificador único del registro
            'idCompra': self.idCompra,  # Identificador de la compra relacionada
            'idProducto': self.idProducto,  # Identificador del producto relacionado
            'cantidad': self.cantidad,  # Cantidad de producto comprado
            'importe': self.importe,  # Importe total correspondiente al producto
            'calificacion': self.calificacion,  # Calificación asignada (puede ser `None`)
            'comentario': self.comentario  # Comentario sobre el producto (puede ser `None`)
        }

