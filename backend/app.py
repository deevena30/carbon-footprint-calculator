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
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:suscell@localhost:5433/carbon_footprint')
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
    print(f"User registered: {username} (ID: {user.id})")
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
    print(f"Questionnaire data saved for user {user_id}, score: {data.get('greenScore', 'N/A')}")
    return jsonify({'msg': 'Data submitted successfully'}), 201

@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    
    # Get the most recent questionnaire data
    latest_data = QuestionnaireData.query.filter_by(user_id=user_id).order_by(QuestionnaireData.submitted_at.desc()).first()
    
    if not latest_data:
        return jsonify({'msg': 'No questionnaire data found'}), 404
    
    # Get all scores to exclude the current one and handle duplicates
    all_scores = QuestionnaireData.query.filter_by(user_id=user_id).order_by(QuestionnaireData.submitted_at.desc()).all()
    
    # Format all scores and remove duplicates
    formatted_scores = []
    seen_scores = set()
    
    for score in all_scores:
        score_data = score.data
        if isinstance(score_data, dict) and 'greenScore' in score_data:
            score_key = f"{score_data.get('greenScore', 0)}-{score_data.get('carbonScore', 0)}-{score_data.get('waterScore', 0)}-{score_data.get('wasteScore', 0)}"
            
            if score_key not in seen_scores:
                seen_scores.add(score_key)
                formatted_scores.append({
                    'date': score.submitted_at.isoformat(),
                    'greenScore': score_data.get('greenScore', 0),
                    'carbonScore': score_data.get('carbonScore', 0),
                    'waterScore': score_data.get('waterScore', 0),
                    'wasteScore': score_data.get('wasteScore', 0),
                    'totalCarbon': score_data.get('totalCarbon', 0)
                })
    
    # Exclude the current score (first one) and take up to 3 previous scores
    formatted_recent_scores = formatted_scores[1:4] if len(formatted_scores) > 1 else []
    
    # Return the dashboard data with recent scores
    dashboard_data = latest_data.data
    
    return jsonify({'dashboard': dashboard_data, 'recentScores': formatted_recent_scores})

@app.route('/api/top-users', methods=['GET'])
@jwt_required()
def get_top_users():
    try:
        # Get all users with their latest questionnaire data
        from sqlalchemy import func
        
        # First, let's get all questionnaire data with user info
        all_data = db.session.query(
            User.username,
            QuestionnaireData.data,
            QuestionnaireData.submitted_at
        ).join(
            User,
            QuestionnaireData.user_id == User.id
        ).all()
        
        print(f"Found {len(all_data)} total records")
        
        # Group by username and get the latest for each user
        user_latest_data = {}
        for record in all_data:
            username = record.username
            if username not in user_latest_data or record.submitted_at > user_latest_data[username]['submitted_at']:
                user_latest_data[username] = {
                    'username': username,
                    'data': record.data,
                    'submitted_at': record.submitted_at
                }
        
        print(f"Found {len(user_latest_data)} unique users")
        
        # Convert to list and filter for valid scores
        top_users = []
        for user_data in user_latest_data.values():
            if isinstance(user_data['data'], dict) and 'greenScore' in user_data['data']:
                top_users.append({
                    'username': user_data['username'],
                    'greenScore': user_data['data'].get('greenScore', 0),
                    'carbonScore': user_data['data'].get('carbonScore', 0),
                    'waterScore': user_data['data'].get('waterScore', 0),
                    'wasteScore': user_data['data'].get('wasteScore', 0)
                })
        
        # Sort by greenScore in descending order
        top_users.sort(key=lambda x: x['greenScore'], reverse=True)
        
        # Limit to top 10
        top_users = top_users[:10]
        
        print(f"Returning {len(top_users)} top users")
        print("Top users:", top_users)
        
        return jsonify({'topUsers': top_users})
    except Exception as e:
        print(f"Error in get_top_users: {e}")
        return jsonify({'topUsers': [], 'error': str(e)}), 500

@app.route('/api/debug/data', methods=['GET'])
def debug_data():
    try:
        # Get all users
        users = User.query.all()
        user_data = []
        for user in users:
            user_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'created_at': user.created_at.isoformat() if user.created_at else None
            })
        
        # Get all questionnaire data
        questionnaire_data = QuestionnaireData.query.all()
        q_data = []
        for q in questionnaire_data:
            q_data.append({
                'id': q.id,
                'user_id': q.user_id,
                'submitted_at': q.submitted_at.isoformat() if q.submitted_at else None,
                'data': q.data
            })
        
        return jsonify({
            'users': user_data,
            'questionnaire_data': q_data,
            'total_users': len(user_data),
            'total_questionnaires': len(q_data)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.cli.command('init-db')
def init_db():
    db.create_all()
    print('Database tables created.')

if __name__ == '__main__':
    app.run(debug=True)