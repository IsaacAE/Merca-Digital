from flask import Blueprint, session, render_template

# Crear un Blueprint llamado 'catalogue' con un prefijo de URL '/catalogue'
catalogue = Blueprint('catalogue', __name__, url_prefix='/catalogue')

# Lista de items disponibles en el catálogo
items = ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9"]

# Lista de items especiales que se simulan para un usuario con sesión activa
ferfong_items = ["item2", "item4"]

# Ruta principal para ver los items del catálogo
@catalogue.route('/')
def view_items():
    # Verificar si existe una sesión activa con un 'user_id' en la sesión
    if session.get('user_id') is None:
        # Si no hay usuario logueado, renderiza el catálogo con todos los items
        return render_template('catalogue.html', items=items)
    # Si el usuario tiene sesión activa (es decir, un 'user_id' está presente), renderiza el catálogo con los items especiales
    return render_template('catalogue.html', items=ferfong_items)

