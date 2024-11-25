# OOZMA KAPPA

## Merca-Digital

La empresa OOZMA KAPPA se enorgullece de presentar el proyecto Merca-Digital. Un sistema de compraventa pensado y diseñado para los estudiantes de la Facultad de Ciencas de la UNAM como una innovación a la emergente "Mercadita" que busca llevar este sistema al mundo digital para beneficiar a compradores y vendedores con un sistema claro, rápido y de pronta comunicación para solucionar los problemas que se han presentado con la constante expansión del mencionado mercado del estudiantado.

## Colaboradores

- Alcántara Estrada Kevin Isaac
- Lira Rivera Moisés Abraham
- Rios Hernández Diego
- Sánchez Rosas ROberto Samuel

## Especificaciones 

### Lenguajes de programación
- **Python**: Versión **3.12.1** (Nov 2024)
- **JavaScript**: **ECMAScript 2024** (última actualización de la especificación)
- **HTML**: **HTML5** (especificación final establecida)
- **CSS**: **CSS3** (incluyendo módulos recientes como CSS Grid y Flexbox)
- **SQL**: Basado en la especificación **SQL:2016**

### Frameworks
- **SQLAlchemy**: Versión **2.1.0** (Nov 2024)
- **Flask**: Versión **3.1.x** (Nov 2024)
- **React**: Versión **18.2.0** (última estable)

### Controladores de versiones
- **Git**: Versión **2.42.0** (última estable)
- **GitHub**: No tiene versiones específicas; se encuentra actualizado con las últimas funcionalidades.

### IDE y herramientas
- **Visual Studio Code**: Versión **1.85.0** (Nov 2024)
- **PostgreSQL**: Versión **16.0** (última estable)

### Referencias
- [Python](https://www.python.org/downloads/)
- [ECMAScript](https://tc39.es/ecma262/)
- [SQLAlchemy](https://docs.sqlalchemy.org/)
- [Flask](https://flask.palletsprojects.com/)
- [React](https://react.dev/)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Visual Studio Code](https://code.visualstudio.com/)

## Preparativos

### Para app-flask:

1. Crear y activar un entorno virtual en Python

En Windows:
python -m venv venv
venv\Scripts\activate

En sistemas Unix (Linux/macOS):
python3 -m venv venv
source venv/bin/activate

2. Instalar las dependencias

- Opción 1: Instalar paquetes uno por uno
pip install pymysql Flask-SQLAlchemy alchemy SQLAlchemy pycryptodomex flask cryptography flask-cors Flask-Reuploaded

- Opción 2: Usar el archivo requirements.txt
pip install -r requirements.txt


### Para app-react:

1. Instalar dependencias necesarias (en Windows y Unix)

- npm install sweetalert2
- npm install react-range
- npm install react-cookie
- npm install react-scripts
- npm install

- Si es necesario, instalar paquetes adicionales con el comando:
npm install <nombre_paquete>

## Ejecución

1. Entrar al directorio /app-flask
2. Ejecutar la aplicación Flask con el comando: python -m flask run
3. Entrar al directorio /app-react
4. Ejecutar la aplicación React con el comando: npm start


### Nota

Es requerido ejecutar el script de BD.sql para levantar la base de datos y conectarse a la misma.
