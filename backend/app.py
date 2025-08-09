from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os
from extensions import db, bcrypt, jwt
from models import *
from flask import request, jsonify
from models import User
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import QuestionnaireData
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/carbon_footprint')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')
db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# Placeholder for routes and models

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
        return jsonify({'msg': 'Missing fields'}), 400
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'msg': 'User already exists'}), 409
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(username=username, email=email, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username_or_email = data.get('username')
    password = data.get('password')
    user = User.query.filter((User.username == username_or_email) | (User.email == username_or_email)).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'msg': 'Invalid credentials'}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 200

@app.route('/api/data', methods=['POST'])
@jwt_required()
def submit_data():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({'msg': 'No data provided'}), 400
    
    # Add timestamp to the data
    data['submitted_at'] = datetime.utcnow().isoformat()
    
    qdata = QuestionnaireData(user_id=user_id, data=data)
    db.session.add(qdata)
    db.session.commit()
    return jsonify({'msg': 'Data submitted successfully'}), 201

@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    
    # Get the most recent questionnaire data
    latest_data = QuestionnaireData.query.filter_by(user_id=user_id).order_by(QuestionnaireData.submitted_at.desc()).first()
    
    if not latest_data:
        return jsonify({'msg': 'No questionnaire data found'}), 404
    
    # Get recent scores (last 3)
    recent_scores = QuestionnaireData.query.filter_by(user_id=user_id).order_by(QuestionnaireData.submitted_at.desc()).limit(3).all()
    
    # Format recent scores
    formatted_recent_scores = []
    for score in recent_scores:
        score_data = score.data
        if isinstance(score_data, dict) and 'greenScore' in score_data:
            formatted_recent_scores.append({
                'date': score.submitted_at.isoformat(),
                'greenScore': score_data.get('greenScore', 0),
                'carbonScore': score_data.get('carbonScore', 0),
                'waterScore': score_data.get('waterScore', 0),
                'wasteScore': score_data.get('wasteScore', 0),
                'totalCarbon': score_data.get('totalCarbon', 0)
            })
    
    # Return the dashboard data with recent scores
    dashboard_data = latest_data.data
    
    return jsonify({'dashboard': dashboard_data, 'recentScores': formatted_recent_scores})

@app.cli.command('init-db')
def init_db():
    db.create_all()
    print('Database tables created.')

if __name__ == '__main__':
    app.run(debug=True)