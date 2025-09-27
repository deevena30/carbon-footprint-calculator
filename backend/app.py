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
from datetime import datetime, timedelta
import json
from flask_cors import CORS  
import csv

app = Flask(__name__)
# More permissive CORS for deployment
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://*.vercel.app",
            "https://carbon-footprint-calculator-p1km.vercel.app",
            "https://vercel.app"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})
# Configurations
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:suscell@localhost:5432/carbon_footprint')

# Handle Neon's database connection requirements
if 'neon.tech' in app.config['SQLALCHEMY_DATABASE_URI']:
    # Neon requires SSL
    if 'sslmode=' not in app.config['SQLALCHEMY_DATABASE_URI']:
        app.config['SQLALCHEMY_DATABASE_URI'] += '?sslmode=require'
# Use a more consistent default JWT secret key
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'carbon-footprint-calculator-default-jwt-secret-2025')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)  # Token expires in 1 day
app.config['JWT_CSRF_IN_COOKIES'] = False  # Disable CSRF for API requests
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Disable CSRF protection

# Handle Railway's PostgreSQL URL format
if app.config['SQLALCHEMY_DATABASE_URI'].startswith('postgres://'):
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace('postgres://', 'postgresql://', 1)
db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# Placeholder for routes and models

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'Carbon Footprint Calculator Backend API',
        'status': 'running',
        'endpoints': ['/api/register', '/api/login', '/api/data', '/api/dashboard', '/api/health']
    }), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Backend is running'}), 200

@app.route('/api/jwt-config', methods=['GET'])
def jwt_config():
    return jsonify({
        'jwt_secret_set': bool(os.getenv('JWT_SECRET_KEY')),
        'jwt_secret_length': len(os.getenv('JWT_SECRET_KEY', '')) if os.getenv('JWT_SECRET_KEY') else 0,
        'jwt_algorithm': 'HS256',
        'jwt_expires': str(app.config.get('JWT_ACCESS_TOKEN_EXPIRES', 'Not set')),
        'using_default_secret': os.getenv('JWT_SECRET_KEY') == 'carbon-footprint-calculator-default-jwt-secret-2025' or not os.getenv('JWT_SECRET_KEY')
    }), 200

@app.route('/api/headers-test', methods=['GET', 'POST', 'OPTIONS'])
def headers_test():
    """Test endpoint to debug header reception without JWT requirement"""
    auth_header = request.headers.get('Authorization')
    all_headers = dict(request.headers)
    
    return jsonify({
        'method': request.method,
        'authorization_header': auth_header,
        'auth_header_present': bool(auth_header),
        'headers_received': all_headers,
        'origin': request.headers.get('Origin'),
        'content_type': request.headers.get('Content-Type')
    }), 200

@app.route('/api/auth-test', methods=['GET'])
@jwt_required()
def auth_test():
    try:
        # Debug JWT token
        auth_header = request.headers.get('Authorization')
        print(f"Auth header received: {auth_header[:50]}..." if auth_header else "No auth header")
        
        user_id = get_jwt_identity()
        print(f"JWT Identity: {user_id}")
        
        user = User.query.get(user_id) if user_id else None
        print(f"User found: {user.username if user else 'None'}")
        
        return jsonify({
            'status': 'authenticated',
            'user_id': user_id,
            'username': user.username if user else None,
            'message': 'JWT token is valid'
        }), 200
    except Exception as e:
        auth_header = request.headers.get('Authorization')
        print(f"JWT Error: {e}")
        print(f"Auth header: {auth_header[:50]}..." if auth_header else "No auth header")
        return jsonify({
            'status': 'error',
            'message': 'JWT token validation failed',
            'error': str(e),
            'auth_header_present': bool(auth_header)
        }), 401

@app.route('/api/init-tables', methods=['POST'])
def init_tables():
    try:
        db.create_all()
        user_count = User.query.count()
        questionnaire_count = QuestionnaireData.query.count()
        return jsonify({
            'status': 'success',
            'message': 'Database tables created successfully',
            'user_count': user_count,
            'questionnaire_count': questionnaire_count
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Failed to create tables',
            'error': str(e)
        }), 500

@app.route('/api/db-status', methods=['GET'])
def db_status():
    try:
        # Try to connect to database
        from sqlalchemy import text
        db.session.execute(text('SELECT 1'))
        db.session.commit()
        
        # Check if tables exist
        try:
            user_count = User.query.count()
            questionnaire_count = QuestionnaireData.query.count()
            return jsonify({
                'status': 'connected',
                'message': 'Database is connected and accessible',
                'user_count': user_count,
                'questionnaire_count': questionnaire_count,
                'database_url': os.getenv('DATABASE_URL', 'Not set')[:50] + '...' if os.getenv('DATABASE_URL') else 'Not set'
            }), 200
        except Exception as table_error:
            return jsonify({
                'status': 'connected_no_tables',
                'message': 'Database connected but tables may not exist',
                'error': str(table_error),
                'database_url': os.getenv('DATABASE_URL', 'Not set')[:50] + '...' if os.getenv('DATABASE_URL') else 'Not set'
            }), 200
            
    except Exception as e:
        return jsonify({
            'status': 'disconnected',
            'message': 'Cannot connect to database',
            'error': str(e),
            'database_url': os.getenv('DATABASE_URL', 'Not set')[:50] + '...' if os.getenv('DATABASE_URL') else 'Not set'
        }), 503

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return jsonify({'msg': 'Missing fields'}), 400
        
        # Check if database is available
        try:
            existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
            if existing_user:
                return jsonify({'msg': 'User already exists'}), 409
        except Exception as db_error:
            print(f"Database connection error during user check: {db_error}")
            return jsonify({
                'msg': 'Database connection error. Please ensure PostgreSQL database is connected.',
                'error': 'Database unavailable',
                'details': str(db_error)
            }), 503
        
        try:
            pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
            user = User(username=username, email=email, password_hash=pw_hash)
            db.session.add(user)
            db.session.commit()
            print(f"User registered: {username} (ID: {user.id})")
            return jsonify({'msg': 'User registered successfully'}), 201
        except Exception as db_error:
            db.session.rollback()
            print(f"Database error during user creation: {db_error}")
            return jsonify({
                'msg': 'Failed to create user due to database error',
                'error': 'Database write error',
                'details': str(db_error)
            }), 503
            
    except Exception as e:
        print(f"General error in register endpoint: {e}")
        return jsonify({
            'msg': 'An unexpected error occurred',
            'error': 'Server error',
            'details': str(e)
        }), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username_or_email = data.get('username')
        password = data.get('password')
        
        if not username_or_email or not password:
            return jsonify({'msg': 'Username/email and password are required'}), 400
        
        user = User.query.filter((User.username == username_or_email) | (User.email == username_or_email)).first()
        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            return jsonify({'msg': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=user.id)
        print(f"User logged in: {user.username} (ID: {user.id})")
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({
            'msg': 'An error occurred during login',
            'error': str(e)
        }), 500

@app.route('/api/data', methods=['POST'])
@jwt_required()
def submit_data():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({'msg': 'No data provided'}), 400
    existing = QuestionnaireData.query.filter_by(user_id=user_id).order_by(QuestionnaireData.submitted_at.desc()).first()
    if existing and isinstance(existing.data, dict):
        if existing.data.get('greenScore') == data.get('greenScore'):
            if abs((datetime.utcnow() - existing.submitted_at).total_seconds()) < 2:
                return jsonify({'msg': 'Duplicate submission ignored'}), 200
    # Add timestamp to the data
    data['submitted_at'] = datetime.utcnow().isoformat()
    
    qdata = QuestionnaireData(user_id=user_id, data=data)
    db.session.add(qdata)
    db.session.commit()
    print(f"Questionnaire data saved for user {user_id}, score: {data.get('greenScore', 'N/A')}")
    export_all_to_csv()
    return jsonify({'msg': 'Data submitted successfully'}), 201

@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    try:
        # Debug the actual request
        auth_header = request.headers.get('Authorization')
        print(f"[DASHBOARD] Auth header: {auth_header[:50]}..." if auth_header else "[DASHBOARD] No auth header")
        print(f"[DASHBOARD] Request method: {request.method}")
        print(f"[DASHBOARD] Request origin: {request.headers.get('Origin')}")
        
        user_id = get_jwt_identity()
        print(f"[DASHBOARD] JWT Identity: {user_id}")
        
        # Validate user_id
        if not user_id:
            return jsonify({'msg': 'Invalid or missing authentication token'}), 401
            
        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({'msg': 'User not found'}), 404
        
        # Get the most recent questionnaire data
        latest_data = QuestionnaireData.query.filter_by(user_id=user_id).order_by(QuestionnaireData.submitted_at.desc()).first()
        
        if not latest_data:
            # Return empty dashboard for new users
            return jsonify({
                'msg': 'Welcome! Complete your first carbon footprint assessment to see your dashboard.',
                'dashboard': {
                    'greenScore': 0,
                    'carbonScore': 0, 
                    'waterScore': 0,
                    'wasteScore': 0,
                    'totalCarbon': 0,
                    'isFirstTime': True
                },
                'recentScores': []
            }), 200
        
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
        
    except Exception as e:
        print(f"Dashboard error: {e}")
        return jsonify({
            'msg': 'Error loading dashboard',
            'error': str(e),
            'dashboard': {
                'greenScore': 0,
                'carbonScore': 0,
                'waterScore': 0, 
                'wasteScore': 0,
                'totalCarbon': 0,
                'isFirstTime': True
            },
            'recentScores': []
        }), 200

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

@app.route('/api/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'msg': 'User not found'}), 404
        
        # Delete all questionnaire data for this user
        QuestionnaireData.query.filter_by(user_id=user_id).delete()
        
        # Delete the user
        db.session.delete(user)
        db.session.commit()
        
        print(f"Account deleted for user: {user.username} (ID: {user_id})")
        export_all_to_csv()
        return jsonify({'msg': 'Account deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting account: {e}")
        return jsonify({'error': 'Failed to delete account'}), 500

@app.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'msg': 'User not found'}), 404
        
        notifications = []
        
        # Check if user hasn't taken assessment in 7 days
        last_assessment = QuestionnaireData.query.filter_by(user_id=user_id).order_by(QuestionnaireData.submitted_at.desc()).first()
        
        if last_assessment:
            days_since_last = (datetime.utcnow() - last_assessment.submitted_at).days
            
            if days_since_last >= 7:
                notifications.append({
                    'type': 'reminder',
                    'title': 'Time for a Progress Check! 🌱',
                    'message': f'Hey {user.username}! It\'s been {days_since_last} days since your last assessment. Let\'s see how much you\'ve improved your carbon footprint!',
                    'action': 'Take Assessment',
                    'priority': 'high'
                })
        
        # Check if user is new (registered within 3 days)
        days_since_registration = (datetime.utcnow() - user.created_at).days
        if days_since_registration <= 3:
            notifications.append({
                'type': 'welcome',
                'title': 'Welcome to Your Sustainability Journey! 🌍',
                'message': f'Hi {user.username}! Ready to start tracking your carbon footprint? Take your first assessment to see where you stand!',
                'action': 'Start Assessment',
                'priority': 'medium'
            })
        
        # Check if user has improved their score
        if last_assessment:
            previous_assessments = QuestionnaireData.query.filter_by(user_id=user_id).order_by(QuestionnaireData.submitted_at.desc()).limit(2).all()
            
            if len(previous_assessments) >= 2:
                current_score = previous_assessments[0].data.get('greenScore', 0)
                previous_score = previous_assessments[1].data.get('greenScore', 0)
                
                if current_score > previous_score:
                    improvement = current_score - previous_score
                    notifications.append({
                        'type': 'achievement',
                        'title': 'Great Progress! 🎉',
                        'message': f'Congratulations {user.username}! Your carbon score improved by {improvement:.1f} points! Keep up the amazing work!',
                        'action': 'View Progress',
                        'priority': 'high'
                    })
        
        return jsonify({'notifications': notifications, 'count': len(notifications)})
        
    except Exception as e:
        print(f"Error getting notifications: {e}")
        return jsonify({'notifications': [], 'count': 0})



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



@app.route('/api/export/all', methods=['GET'])
def export_all_to_csv():
    users = User.query.all()
    with open('all_data_export.csv', 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['user_id', 'username', 'email', 'created_at', 'questionnaire_id', 'submitted_at', 'greenScore', 'carbonScore', 'waterScore', 'wasteScore', 'totalCarbon']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for user in users:
            questionnaires = QuestionnaireData.query.filter_by(user_id=user.id).all()
            seen = set()
            for q in questionnaires:
                data = q.data if isinstance(q.data, dict) else {}
                key = (
                    round(q.submitted_at.timestamp()),  # round to nearest second
                    data.get('greenScore', ''),
                    data.get('carbonScore', ''),
                    data.get('waterScore', ''),
                    data.get('wasteScore', ''),
                    data.get('totalCarbon', '')
                )
                if key in seen:
                    continue  # skip duplicate
                seen.add(key)
                writer.writerow({
                    'user_id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'created_at': user.created_at.isoformat() if user.created_at else '',
                    'questionnaire_id': q.id,
                    'submitted_at': q.submitted_at.isoformat() if q.submitted_at else '',
                    'greenScore': data.get('greenScore', ''),
                    'carbonScore': data.get('carbonScore', ''),
                    'waterScore': data.get('waterScore', ''),
                    'wasteScore': data.get('wasteScore', ''),
                    'totalCarbon': data.get('totalCarbon', '')
                })
    print('Data exported to all_data_export.csv')

@app.cli.command('init-db')
def init_db():
    db.create_all()
    print('Database tables created.')
    export_all_to_csv()

# Initialize database tables when app starts
def create_tables():
    with app.app_context():
        try:
            db.create_all()
            print('Database tables created successfully')
        except Exception as e:
            print(f'Error creating database tables: {e}')

# Create tables on startup
create_tables()

if __name__ == '__main__':
    with app.app_context():
        try:
            # Try to create tables if they don't exist
            db.create_all()
            print('Database tables initialized.')
            export_all_to_csv()
        except Exception as e:
            print(f'Database initialization error: {e}')
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
