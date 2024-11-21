# Importaciones necesarias para la aplicación
from flask import Flask, redirect, render_template, url_for, request, flash, session, jsonify, send_from_directory
from alchemyClasses import db  # Base de datos configurada con SQLAlchemy
from flask_uploads import UploadSet, configure_uploads, IMAGES  # Manejo de carga de archivos
from controller.ControllerUsuario import usuario_blueprint  # Controlador para usuarios
from controller.ControllerProducto import producto_blueprint  # Controlador para productos
from controller.ControllerCategoria import categoria_blueprint  # Controlador para categorías
from controller.ControllerTener import tener_blueprint  # Controlador para relaciones de "tener"
from controller.ControllerAlmacenar import almacenar_blueprint  # Controlador para almacenes
from controller.ControllerCompra import compra_blueprint  # Controlador para compras
from controller.ControllerContener import contener_blueprint  # Controlador para contener productos en compras
from Model import model_productos  # Modelo de datos para productos
import smtplib  # Para envío de correos electrónicos
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_cors import CORS, cross_origin  # Configuración de CORS
import json
import os

# Creación de la aplicación Flask
app = Flask(__name__)
cors = CORS(app)  # Habilitación de CORS para la app
app.config['CORS_HEADERS'] = 'Access-Control-Allow-Origin'  # Encabezados CORS permitidos

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://lab:Developer123!@localhost:3306/Tienda'  # URI de la BD
app.config.from_mapping(SECRET_KEY='dev')  # Llave secreta para la app

# Configuración para manejo de archivos e imágenes
app.config['UPLOADS_DEFAULT_DEST'] = './ProductosImg'
app.config['UPLOADS_IMAGES_DEST'] = './ProductosImg/imagenes'
app.config['UPLOADED_IMAGES_DEST'] = './ProductosImg/imagenes'
app.config['UPLOADED_IMAGES_ALLOW'] = IMAGES
imagenes = UploadSet('imagenes', IMAGES)  # Conjunto de archivos tipo imagen
configure_uploads(app, imagenes)  # Configuración de carga para Flask-Uploads

# Inicialización de la base de datos con Flask
db.init_app(app)

# Registro de blueprints para modularidad
app.register_blueprint(usuario_blueprint)
app.register_blueprint(producto_blueprint)
app.register_blueprint(categoria_blueprint)
app.register_blueprint(tener_blueprint)
app.register_blueprint(almacenar_blueprint)
app.register_blueprint(compra_blueprint)
app.register_blueprint(contener_blueprint)

# Ruta para guardar imágenes cargadas
@app.route('/imagenes/guardar', methods=['POST'])
def guardar_imagen():
    archivos = request.files.getlist('imagen0')  # Obtener lista de imágenes cargadas
    rutas_imagenes = []
    for archivo in archivos:
        nombre_archivo = imagenes.save(archivo)  # Guardar imagen en la ruta configurada
        rutas_imagenes.append(nombre_archivo)
    # Retornar las rutas de las imágenes como JSON
    return jsonify({'rutas_imagenes': rutas_imagenes})

# Ruta para eliminar imágenes
@app.route('/imagenes/eliminar', methods=['POST'])
def eliminar_imagen():
    nombre_imagen = request.form.get('nombre_imagen')  # Nombre de la imagen a eliminar
    try:
        ruta_imagen = os.path.join(app.config['UPLOADS_IMAGES_DEST'], nombre_imagen)  # Construir ruta completa
        if os.path.exists(ruta_imagen):  # Verificar existencia del archivo
            os.remove(ruta_imagen)  # Eliminar imagen
            return json.dumps({'mensaje': f'La imagen {nombre_imagen} ha sido eliminada correctamente'})
        else:
            return json.dumps({'error': 'La imagen no existe en el servidor'})
    except Exception as e:
        return json.dumps({'error': str(e)})

# Ruta para listar productos
@app.route('/products', methods=['GET'])
def products():
    products = model_productos.read_products()  # Consultar productos del modelo
    return jsonify([product.to_dict() for product in products])  # Retornar productos como JSON

# Ruta para servir imágenes desde el servidor
@app.route('/imagenes/<nombre_imagen>')
def servir_imagen(nombre_imagen):
    try:
        ruta_imagen = os.path.join(app.config['UPLOADED_IMAGES_DEST'], nombre_imagen)  # Ruta completa
        if os.path.exists(ruta_imagen):
            return send_from_directory(app.config['UPLOADED_IMAGES_DEST'], nombre_imagen)  # Enviar archivo
        else:
            return jsonify({'error': 'Imagen no encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para enviar correo de confirmación de cuenta
@app.route('/correos/cuenta', methods=['POST'])
def enviar_correo_cuenta():
    from_email = "prometienda.fc@gmail.com"  # Correo del remitente
    password = "uictyyyzilngdczu"  # Contraseña del correo
    name = request.form.get('nombre')  # Nombre del usuario
    to_email = request.form.get('correo')  # Correo del destinatario
    user_password = request.form.get('contraseña')  # Contraseña del usuario
    message = f"Hola, {name}.\n\nEste correo es para informar que la creación de tu cuenta en Prometienda ha sido exitosa.\n\nNo olvides que tu contraseña es: {user_password}"
    
    # Configuración del mensaje de correo
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = "Creación de cuenta exitosa"
    msg.attach(MIMEText(message, 'plain'))

    # Envío del correo
    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()  # Habilitar seguridad
            server.login(from_email, password)  # Iniciar sesión
            server.sendmail(from_email, to_email, msg.as_string())  # Enviar correo
        return json.dumps({'success': 'usuario_incorrecto'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para notificar a vendedores sobre ventas
@app.route('/correos/notificar', methods=['POST'])
def enviar_correo_notificacion():
    from_email = "prometienda.fc@gmail.com"
    password = "uictyyyzilngdczu"
    data = request.get_json()

    # Validar datos recibidos
    if 'idCompra' not in data or 'products' not in data or not isinstance(data['products'], list):
        return jsonify({'success': False, 'error': 'Datos incompletos'}), 400

    idCompra = data['idCompra']
    products = data['products']
    lista_correos = set()  # Lista de correos únicos

    # Obtener correos y enviar notificaciones
    for product in products:
        correo = model_productos.get_email_seller(product['idProducto'])  # Correo del vendedor
        if correo:
            lista_correos.add(correo)

    # Crear mensaje y enviarlo a cada vendedor
    for correo in lista_correos:
        detalles_noti = ""
        total_venta = 0
        for product in products:
            producto = model_productos.read_product(product['idProducto'])
            if producto:
                detalles_noti += f"{producto.nombreProducto} - Cantidad: {product['cantidad']} - Importe: {product['importe']} pesos\n"
                total_venta += product['importe']
        message = f"¡Hola!, han comprado algunos de tus productos:\n{detalles_noti}\nTotal venta: {total_venta} pesos."

        # Configurar correo
        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = correo
        msg['Subject'] = f"Venta exitosa. ID: {idCompra}"
        msg.attach(MIMEText(message, 'plain'))

        try:
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login(from_email, password)
                server.sendmail(from_email, correo, msg.as_string())
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'success': True}), 200

# Ejecutar la aplicación
if __name__ == '__main__':
    app.run()

