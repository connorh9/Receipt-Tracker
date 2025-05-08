#Flask app instance goes here
#initialize sqlite connection or sqlalchemy
import os
from flask import Flask
from .db import init_app
from flask import cli

app = Flask(__name__)

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(os.path.dirname(__file__), 'database.db')
    )

    os.makedirs(app.instance_path, exist_ok=True)

    init_app(app)

    from . import routes
    app.register_blueprint(routes.bp)

    return app