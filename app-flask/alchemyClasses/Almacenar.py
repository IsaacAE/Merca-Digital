# Clase Almacenar que representa la tabla 'Almacenar' en la base de datos
class Almacenar(db.Model):
    __tablename__ = 'Almacenar'  # Nombre de la tabla en la base de datos

    # Definición de las columnas de la tabla
    idAlmacenar = Column(Integer, primary_key=True)  # Llave primaria de la tabla
    idCarrito = Column(Integer, ForeignKey('Tener.idCarrito'))  # Llave foránea que referencia a la tabla 'Tener'
    idProducto = Column(Integer, ForeignKey('Producto.idProducto'))  # Llave foránea que referencia a la tabla 'Producto'
    cantidad = Column(Integer)  # Columna que almacena la cantidad de productos en el carrito

    # Constructor de la clase para inicializar los atributos
    def __init__(self, idCarrito, idProducto, cantidad):
        self.idCarrito = idCarrito
        self.idProducto = idProducto
        self.cantidad = cantidad

    # Método especial para representar la clase como una cadena (útil para depuración)
    def __str__(self):
        return f'Carrito: {self.idCarrito}, Producto: {self.idProducto}, Cantidad: {self.cantidad}'

    # Método para convertir la instancia a un diccionario (útil para respuestas JSON)
    def to_dict(self):
        return {
            'idCarrito': self.idCarrito,
            'idProducto': self.idProducto,
            'cantidad': self.cantidad
        }

    # Nota: Este método parece duplicado o mal implementado
    # Debería corregirse o eliminarse si no es necesario
    def _str_(self):
        return f'Usuario: {self.nombre} {self.apPat} {self.apMat} {self.correo} {self.telefono} {self.contraseña} {self.imagen} {self.vendedor}, Carrito: {self.idCarrito}'

