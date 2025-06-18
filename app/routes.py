from flask import Blueprint, request, jsonify
import app.backend as backend
from .db import get_db
import json
import numpy as np
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from jwt import ExpiredSignatureError, decode, jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import os
from flask_mailman import Mail, EmailMessage

load_dotenv()


bp = Blueprint('bp', __name__)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
SECRET_KEY = os.getenv('SECRET_KEY', "")

def allowed_file(filename):
    #make sure it is of acceptable file type
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS

def generate_jwt(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=30)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def generate_reset_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Token missing'}), 401

        try:
            data = decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = data['user_id']
        except ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except Exception as e:
            return jsonify({'message': 'Token invalid'}), 401

        return f(*args, **kwargs)
    return decorated

@bp.route('/upload', methods=['POST'])
def addReceipt():
    #check if an image was uploaded and retrieve image
    if 'image' not in request.files:
        return jsonify({'message': 'No image sent in request'}), 400
    
    if 'user_id' not in request.form:
        return jsonify({'message': 'Please make sure you are logged in'}), 400
    
    file = request.files['image']
    user_id = request.form.get('user_id')

    if file.filename == '':
        return jsonify({'message':'No image selected for uploading'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'message':'File type not allowed'}), 400
    
    #process the receipt image
    extracted_text = backend.extract_text(file)
    formatted_data = backend.get_formatted_json(extracted_text)

    #check to make sure the backend provided what we need for the db
    if "total" not in formatted_data:
        return jsonify({'message':'Make sure the total is included in the receipt scan'}), 400
    
    if "timestamp" not in formatted_data:
        return jsonify({'message':'Unable to fetch the time of transaction'}), 400
    
    total = formatted_data.get('total')
    business = formatted_data.get('business')
    items = formatted_data.get('items')
    timestamp = formatted_data.get('timestamp')
    expense_type = formatted_data.get('expense_type')
    #user_id = data.get('user_id')

    if None in [total, business, items, timestamp, expense_type, user_id]:
        return jsonify({"error": "missing required json data"}), 400
    
    db = get_db()
    items_str = json.dumps(items)

    #insert into receipt db
    cursor = db.execute(
        '''
        INSERT INTO receipts (total, business, items, timestamp, expense_type, user_id)
        VALUES (?,?,?,?,?,?)
        ''',
        (total, business, items_str, timestamp, expense_type, user_id)
    )

    receipt_id = cursor.lastrowid

    #insert items into db
    for item in items:
        db.execute(
            '''
            INSERT INTO items (item, price, receipt_id)
            VALUES (?,?,?)
            ''',
            (item.get('title'), item.get('price'), receipt_id)
        )

    db.commit()

    return jsonify({"message":"Receipt added successfully!"}), 201
    
@bp.route('/receipts', methods=['GET'])
def fetchReceipts():
    #gets all receipts from most to least recent
    db = get_db()
    cursor = db.execute(
        'SELECT * FROM receipts ORDER BY timestamp DESC'    
    )
    receipts = cursor.fetchall()
    receipts_list = [dict(receipt) for receipt in receipts]

    return jsonify(receipts_list), 200

@bp.route('/register', methods=['POST'])
def registerUser():
    if 'username' not in request.form:
        return jsonify({'message': 'Username missing'}), 400
    if 'password' not in request.form:
        return jsonify({'message': 'Password missing'}), 400
    if 'email' not in request.form:
        return jsonify({'message': 'Email missing'}), 400
    
    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')

    if len(username) < 6:
        return jsonify({'message': 'Username requires 6 characters'}), 400
    if len(password) < 8:
        return jsonify({'message': 'Password requires 8 characters'}), 400
    if not any(char.isdigit() for char in password):
        return jsonify({'message': 'Password requires a number'}), 400

    password_hash = generate_password_hash(password)

    db = get_db()

    cursor = db.execute(
        'SELECT * FROM users WHERE username = ?',
        (username,)
    )
    results = cursor.fetchone()
    if results:
        return jsonify({'message': 'Username already exists'}), 400
    
    cursor = db.execute(
        'SELECT * FROM users WHERE email = ?',
        (email,)
    )
    results = cursor.fetchone()
    if results:
        return jsonify({'message': 'Email already exists'}), 400
    
    cursor = db.execute(
        'INSERT INTO users (username, email, password)',
        (username, email, password)
    )
    user_id = cursor.lastrowid
    if user_id is None:
        return jsonify({'message': "Unable to register user at this time"}), 400

    jwt_token = generate_jwt(user_id)
    return jsonify({'token': jwt_token, 'user_id': user_id}), 200

@bp.route('/login', methods=['POST'])
def login():
    if 'username' not in request.form:
        return jsonify({'message': 'Username missing'}), 400
    if 'password' not in request.form:
        return jsonify({'message': 'Password missing'}), 400
    
    username = request.form.get('username')
    password = request.form.get('password')

    db = get_db()

    cursor = db.execute(
        'SELECT * FROM users WHERE username = ? ', (username,) 
    )

    if not cursor.fetchone():
        return jsonify({'message': 'Username does not exist'})

    rows = cursor.fetchall()

    for row in rows:
        hashed_pw = row[3]
        if(check_password_hash(hashed_pw, password)):
            token = generate_jwt(row[0])
            return jsonify({'message':'Successfully logged in', 'token': token}), 200
    
    return jsonify({'message':'Password is incorrect'}), 400


@bp.route('/reset', methods=['POST'])
def get_reset_token():
    if 'email' not in request.form:
        return jsonify({'message': 'Email not provided'}), 400
    
    email = request.form.get('email')
    db = get_db()

    cursor = db.execute(
        'SELECT * FROM users WHERE email = ? ', (email,)
    )
    row = cursor.fetchone()
    if row is None:
        return jsonify({'message':'Email not in system'}), 400
    
    user_id = row['id']
    token = generate_reset_token(user_id)

    link = f"receipttracker://reset-password-link/${token}"
    msg = EmailMessage(
        'Subject',
        'Body',
        to=[email],
        reply_to=['noreply@receiptreader.com']
    )
    #Will integrate sending email with links later
    return jsonify({"token": token}), 200




