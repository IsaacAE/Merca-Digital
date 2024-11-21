# Importación de módulos necesarios para definir columnas, tipos de datos y relaciones
from sqlalchemy import Column, Integer, String, ForeignKey, Float, Date
from alchemyClasses import db

# Clase Compra que representa la tabla 'Compra' en la base de datos
class Compra(db.Model):
    __tablename__ = 'Compra'  # Nombre de la tabla en la base de datos

    # Definición de las columnas de la tabla
    idCompra = Column(Integer, primary_key=True)  # Llave primaria de la tabla
    idUsuario = Column(Integer, ForeignKey('Usuario.idUsuario'))  # Llave foránea que referencia a la tabla 'Usuario'
    total = Column(Float)  # Columna para almacenar el total de la compra
    fecha = Column(Date)  # Columna para almacenar la fecha de la compra

    # Constructor para inicializar los atributos de la clase
    def __init__(self, idUsuario, total, fecha):
        self.idUsuario = idUsuario  # Asocia la compra a un usuario
        self.total = total  # Asigna el total de la compra
        self.fecha = fecha  # Asigna la fecha en la que se realizó la compra

    # Representación como texto, útil para depuración
    def __str__(self):
        return f'Compra: {self.idCompra}, usuario: {self.idUsuario}, total: {self.total}, fecha: {self.fecha}'

    # Método para convertir la instancia a un diccionario, útil para respuestas JSON
    def to_dict(self):
        return {
            'idCompra': self.idCompra,  # Identificador de la compra
            'idUsuario': self.idUsuario,  # Identificador del usuario relacionado
            'total': self.total,  # Total de la compra
            'fecha': self.fecha.isoformat() if self.fecha else None  # Fecha en formato ISO 8601 o `None` si no existe
        }

