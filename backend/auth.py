from flask import Blueprint,request,jsonify
from flask_login import login_user, logout_user, login_required, current_user
from models import db,User

auth_bp = Blueprint('auth',__name__)


# register as admin or user
@auth_bp.route('/register', methods=["POST"])
def register_page():

    data = request.json
    print("register",data)
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 400
    
    required_fields = ['username', 'email', 'password', 'role']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already registered"}), 400


    new_user = User(username=data['username'], email=data['email'], role=data['role'])
    new_user.set_password(data['password'])

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"})


# login into your account
@auth_bp.route('/login', methods=["POST"])
def login_page():
    data = request.json

    required_fields = ['username', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    user = User.query.filter_by(username=data['username']).first()

    if user and user.check_password(data['password']):
        login_user(user, remember=True)
        return jsonify({
            "message": "Logged in successfully",
            "username": user.username,
            "role": user.role  
        })

    return jsonify({"message": "Invalid credentials"}), 401


# logout
@auth_bp.route('/logout', methods=["POST"])
@login_required
def logout_page():
    logout_user()
    return jsonify({"message": "Logged out successfully"})


# current user
@auth_bp.route('/current_user')
@login_required
def get_current_user():
    return jsonify({'username': current_user.username, 'role': current_user.role})
