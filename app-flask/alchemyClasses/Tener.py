# Importación de módulos necesarios para definir columnas y tipos de datos
from sqlalchemy import Column, Integer, String, ForeignKey
from alchemyClasses import db  # Importación del objeto de base de datos desde alchemyClasses

# Clase Tener que representa la tabla 'Tener' en la base de datos
class Tener(db.Model):
    __tablename__ = 'Tener'  # Nombre de la tabla en la base de datos

    # Definición de las columnas de la tabla
    idCarrito = Column(Integer, primary_key=True)  # Llave primaria, identifica cada carrito
    idComprador = Column(Integer, ForeignKey('Usuario.idUsuario'))  # Llave foránea que conecta con la tabla Usuario
    nombre = Column(String(50))  # Nombre del comprador, con un límite de 50 caracteres
    apPat = Column(String(50))  # Apellido paterno del comprador
    apMat = Column(String(50))  # Apellido materno del comprador
    correo = Column(String(50))  # Correo electrónico del comprador
    telefono = Column(String(10))  # Teléfono del comprador (máximo 10 caracteres)
    contraseña = Column(String(50))  # Contraseña del comprador
    imagen = Column(String(50))  # Ruta o nombre del archivo de la imagen del usuario
    vendedor = Column(Integer, nullable=False)  # Indicador si el usuario es vendedor (por ejemplo: 1 = sí, 0 = no)

    # Constructor para inicializar los atributos
    def __init__(self, idComprador, nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor):
        self.idComprador = idComprador  # ID del comprador (referencia a Usuario)
        self.nombre = nombre  # Nombre del comprador
        self.apPat = apPat  # Apellido paterno
        self.apMat = apMat  # Apellido materno
        self.correo = correo  # Correo electrónico
        self.telefono = telefono  # Número de teléfono
        self.contraseña = contraseña  # Contraseña del usuario
        self.imagen = imagen  # Imagen asociada al usuario
        self.vendedor = vendedor  # Indicador si el usuario es vendedor

    # Representación como cadena, útil para depuración
    def __str__(self):
        return (f'Usuario: {self.nombre} {self.apPat} {self.apMat}, '
                f'Correo: {self.correo}, Teléfono: {self.telefono}, '
                f'Contraseña: {self.contraseña}, Imagen: {self.imagen}, '
                f'Vendedor: {self.vendedor}, Carrito: {self.idCarrito}')

    # Método para convertir la instancia en un diccionario (útil para API REST o serialización)
    def to_dict(self):
        return {
            'idCarrito': self.idCarrito,  # ID único del carrito
            'idComprador': self.idComprador,  # ID del comprador
            'nombre': self.nombre,  # Nombre del comprador
            'apPat': self.apPat,  # Apellido paterno
            'apMat': self.apMat,  # Apellido materno
            'correo': self.correo,  # Correo electrónico
            'telefono': self.telefono,  # Teléfono
            'contraseña': self.contraseña,  # Contraseña
            'imagen': self.imagen,  # Imagen asociada
            'vendedor': self.vendedor  # Indicador si el usuario es vendedor
        }

