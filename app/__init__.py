#Flask app instance goes here
#initialize sqlite connection or sqlalchemy
import os
from flask import Flask
from .db import init_app
from flask import cli
from flask_mailman import Mail

app = Flask(__name__)

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(os.path.dirname(__file__), 'database.db')
    )
    app.config.update({
        "MAIL_SERVER": "smtp.gmail.com",
        "MAIL_PORT": 587,
        "MAIL_USE_TLS": True,
        "MAIL_USERNAME": os.getenv('EMAIL-USERNAME'),
        "MAIL_PASSWORD": os.getenv('EMAIL_PW'),  
        "MAIL_DEFAULT_SENDER": os.getenv('EMAIL')
    })

    mail = Mail(app)

    os.makedirs(app.instance_path, exist_ok=True)

    init_app(app)

    from . import routes
    app.register_blueprint(routes.bp)

    return app