import psycopg2
import psycopg2.extras
from flask import current_app, g
from flask.cli import with_appcontext
import click

DATABASE = 'database.db'

def get_db():
    if 'db' not in g:
        g.db = psycopg2.connect(
            current_app.config['DATABASE'],
            cursor_factory=psycopg2.extras.RealDictCursor
        )
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    with current_app.open_resource('schema.sql') as f:
        with db.cursor() as cur:
            cur.execute(f.read().decode('utf8'))

@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)