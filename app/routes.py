from flask import Blueprint, request, jsonify
import app.backend as backend
from .db import get_db
import json
import numpy as np

bp = Blueprint('bp', __name__)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    #make sure it is of acceptable file type
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS


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
    
    username = request.form.get('username')
    password = request.form.get('password')

    if len(password) < 8:
        return jsonify({'message': 'Password requires 8 characters'}), 400
    if not any(char.isdigit() for char in password):
        return jsonify({'message': 'Password requires a number'}), 400


    db = get_db()
