# Importación de módulos necesarios para definir las columnas y tipos de datos
from sqlalchemy import Column, Integer, String
from alchemyClasses import db  # Importación del objeto de base de datos desde alchemyClasses

# Clase Usuario que representa la tabla 'Usuario' en la base de datos
class Usuario(db.Model):
    __tablename__ = 'Usuario'  # Nombre de la tabla en la base de datos

    # Definición de las columnas de la tabla
    idUsuario = Column(Integer, primary_key=True)  # Llave primaria, identificador único del usuario
    nombre = Column(String(50), nullable=False)  # Nombre del usuario, obligatorio, máximo 50 caracteres
    apPat = Column(String(50), nullable=False)  # Apellido paterno, obligatorio
    apMat = Column(String(50), nullable=False)  # Apellido materno, obligatorio
    correo = Column(String(50), nullable=False)  # Correo electrónico, obligatorio
    telefono = Column(String(10), nullable=False)  # Teléfono, obligatorio, máximo 10 caracteres
    contraseña = Column(String(50), nullable=False)  # Contraseña, obligatorio
    imagen = Column(String(50))  # Imagen asociada al usuario (opcional)
    vendedor = Column(Integer, nullable=False)  # Indicador de si el usuario es vendedor (por ejemplo: 1 = sí, 0 = no)

    # Constructor para inicializar los atributos de la clase
    def __init__(self, nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor):
        self.nombre = nombre  # Nombre del usuario
        self.apPat = apPat  # Apellido paterno
        self.apMat = apMat  # Apellido materno
        self.correo = correo  # Correo electrónico
        self.telefono = telefono  # Número de teléfono
        self.contraseña = contraseña  # Contraseña
        self.imagen = imagen  # Imagen asociada al usuario
        self.vendedor = vendedor  # Indicador si el usuario es vendedor

    # Representación en forma de cadena para depuración
    def __str__(self):
        return (f'Usuario: {self.nombre} {self.apPat} {self.apMat}, '
                f'Correo: {self.correo}, Teléfono: {self.telefono}, '
                f'Contraseña: {self.contraseña}, Imagen: {self.imagen}, '
                f'Vendedor: {self.vendedor}')

    # Método para convertir la instancia en un diccionario (útil para APIs o serialización)
    def to_dict(self):
        return {
            'idUsuario': self.idUsuario,  # Identificador único del usuario
            'nombre': self.nombre,  # Nombre del usuario
            'apPat': self.apPat,  # Apellido paterno
            'apMat': self.apMat,  # Apellido materno
            'correo': self.correo,  # Correo electrónico
            'telefono': self.telefono,  # Teléfono del usuario
            'imagen': self.imagen,  # Imagen asociada al usuario
            'vendedor': self.vendedor  # Indicador si el usuario es vendedor
        }

