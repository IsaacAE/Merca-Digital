create database Tienda;
use Tienda;

create user 'lab'@'localhost' identified by 'Developer123!';

grant all privileges on Tienda.* to 'lab'@'localhost'
with grant option;


DROP TABLE if exists Usuario;
CREATE TABLE Usuario(
	idUsuario int auto_increment,
    nombre varchar(50) not null,
    apPat varchar (50) not null,
    apMat varchar (50) not null,
    correo varchar (50) not null,
    telefono varchar(10) not null,
    contraseña varchar(50) not null,
    imagen varchar(50),
    vendedor tinyint not null,
    primary key (idUsuario)
);


drop table if exists Compra;
CREATE TABLE Compra (
    idCompra int auto_increment,
    idUsuario int,
    total Float,
    fecha Date,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario),
    primary key (idCompra)
);


drop table if exists Carrito;
CREATE TABLE Carrito (
    idCarrito INT auto_increment,
    primary key (idCarrito)
);

drop table if exists Producto;
CREATE TABLE Producto (
    idProducto int auto_increment,
    idUsuario INT,
    nombreProducto VARCHAR(50),
    descripcion text,
    foto varchar(255),
    precio DECIMAL(10,2),
    contacto text,
    cantidad INT,
    primary key (idProducto),
  FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

drop table if exists Tener;
CREATE TABLE Tener (
    idCarrito INT auto_increment,
    idComprador INT,
    nombre VARCHAR(50),
    apPat VARCHAR(50),
    apMat VARCHAR(50),
    correo VARCHAR(100),
    telefono VARCHAR(15),
    contraseña VARCHAR(50),
    imagen varchar(50),
    vendedor tinyint not null,
    primary key (idCarrito),
    FOREIGN KEY (idComprador) REFERENCES Usuario(idUsuario)
);


drop table if exists Almacenar;
CREATE TABLE Almacenar (
	idAlmacenar INT auto_increment,
    idCarrito INT,
    idProducto INT,
    cantidad INT,
    primary key (idAlmacenar),
    FOREIGN KEY (idCarrito) REFERENCES Tener(idCarrito),
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);

drop table if exists Categoria;
CREATE TABLE Categoria (
	idCategoria int auto_increment,
    idProducto INT,
    categoria VARCHAR(255),
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto),
    primary key(idCategoria)
);

drop table if exists Contener;
CREATE TABLE Contener (
    idContener INT auto_increment,
    idCompra INT,
    idProducto INT,
    cantidad INT,
    importe Float,
    calificacion INT,
    comentario text,
    primary key(idContener),
    FOREIGN KEY (idCompra) REFERENCES Compra(idCompra),
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);



DELIMITER //
CREATE TRIGGER after_insert_usuario
AFTER INSERT ON Usuario
FOR EACH ROW
BEGIN
    IF NEW.vendedor = 0 THEN
        INSERT INTO Tener (idComprador, nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor)
        VALUES (NEW.idUsuario, NEW.nombre, NEW.apPat, NEW.apMat, NEW.correo, NEW.telefono, NEW.contraseña, NEW.imagen, NEW.vendedor);
    END IF;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER actualizar_cantidad_producto AFTER INSERT ON Contener
FOR EACH ROW
BEGIN
    UPDATE Producto
    SET cantidad = cantidad - NEW.cantidad
    WHERE idProducto = NEW.idProducto;
END;
//
DELIMITER ;

INSERT INTO Usuario(idUsuario, nombre, apPat, apMat, correo, telefono, contraseña, imagen, vendedor) VALUES
 (31, 'Melissa','Fernández', 'Blancas','melifernandez@ciencias.unam.mx', '5512365478', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e99', '/static/media/dog.cd05990c669aa3660eaa.png', 1),
 (32, 'Isaac','Alcántara', 'Estrada','supersolito84@gmail.com', '5595123647', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e99', '/static/media/tree.9b5503e8f48e77c1b90b.png', 1),
 (33, 'Jatziri','Linares', 'Ríos','jatzirilinaresrios@gmail.com', '5568975412', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e99', '/static/media/cat.f77798d239e960373719.png', 0),
 (34, 'Anshar','Domínguez', 'Barrón','disneyplusdeal@gmail.com', '5549876872', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e99', '/static/media/dog.cd05990c669aa3660eaa.png', 0);


INSERT INTO Producto(idProducto, idUsuario, nombreProducto, descripcion, foto, precio, contacto, cantidad) VALUES
(22, 31, 'Bolsa negra', 'Bolsa negra medio formal', 'Bolsa_Mamalona.jpg', 250.00, 'melifernandez@ciencias.unam.mx', 7),
(23, 31, 'Fresas con crema', 'Deliciosas y frescas fresas con crema perfectas para este calor', 'FRESASCONCREMA.jpg', 30.00, 'melifernandez@ciencias.unam.mx', 10),
(24, 31, 'Vestido gotico', 'Vestido gótico negro talla mediana', 'Goth_Dress.jpg', 200.00, 'melifernandez@ciencias.unam.mx', 3),
(25, 31, 'Mouse para gamers', 'Mouse con luces de colores para gamers', 'MOUSE.jpg', 270.00, 'melifernandez@ciencias.unam.mx', 7),
(26, 31, 'Rinoceronte de peluche', 'Rinoceronte grande de peluche', 'rinoceronte.jpg', 350.00, 'melifernandez@ciencias.unam.mx', 2),
(27, 32, 'Tenis negros', 'Tenis negros marca Flexi talla 27', 'descarga_1.jpeg', 500.00, 'supersolito84@gmail.com', 1),
(28, 32, 'Flores de lego', 'Ramo de flores de lego', 'Lego_Flowers.jpg', 150.00, 'supersolito84@gmail.com', 5),
(29, 32, 'Onigiri de salmón', 'Ricos onigiris de rellenos de salmón', 'onigiri-salmon.jpg', 35.00, 'supersolito84@gmail.com', 10),
(30, 32, 'Guantes para invierno', 'Guantes para el invierno, forrrados con peluche', 'guantes.jpg', 120.00, 'supersolito84@gmail.com', 5),
(31, 32, 'Pin de gatos', 'Pin de gtos del yin y el yang', 'pinGatos.jpg', 30.00, 'supersolito84@gmail.com', 2);


INSERT INTO Categoria(idCategoria, idProducto, categoria) VALUES
(30,22,'regalos'),
(31, 22,'accesorios'),
(32, 23,'alimentos'),
(33, 24,'ropa'),
(34, 24,'regalos'),
(35, 25,'electronica'),
(36, 26,'regalos'),
(37, 27,'accesorios'),
(38, 27,'otra'),
(39, 28,'flores'),
(40, 28,'regalos'),
(41, 29,'alimentos'),
(42, 30,'regalos'),
(43, 30,'accesorios'),
(44, 31,'regalos'),
(45, 31,'papeleria');


select * from Usuario;
