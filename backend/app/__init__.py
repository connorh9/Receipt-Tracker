#Flask app instance goes here
#initialize sqlite connection or sqlalchemy
import os
from flask import Flask
from .db import init_app
from flask import cli
from flask_mailman import Mail
from dotenv import load_dotenv
import redis

load_dotenv()

app = Flask(__name__)
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=6379,
    decode_responses=True
)

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=os.getenv("SECRET_KEY"),
        DATABASE=os.getenv("DATABASE_URL")
    )
    app.config.update({
        "MAIL_SERVER": "smtp.gmail.com",
        "MAIL_PORT": 587,
        "MAIL_USE_TLS": True,
        "MAIL_USERNAME": os.getenv('EMAIL_USERNAME'),
        "MAIL_PASSWORD": os.getenv('EMAIL_PW'),  
        "MAIL_DEFAULT_SENDER": os.getenv('EMAIL')
    })
    app.redis = redis_client

    mail = Mail(app)

    os.makedirs(app.instance_path, exist_ok=True)

    init_app(app)

    from . import routes
    app.register_blueprint(routes.bp)

    return app