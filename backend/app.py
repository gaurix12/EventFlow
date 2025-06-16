from flask import Flask
from config import Config
from models import db,User
from flask_cors import CORS
from flask_login import LoginManager
from auth import auth_bp
from routes import rte_bp

app = Flask(__name__)
# configure the app
app.config.from_object(Config)

db.init_app(app)

# use CORS to connect backend and frontend
CORS(app,supports_credentials=True)

login_manager = LoginManager()
login_manager.init_app(app)
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

#register the routes
app.register_blueprint(auth_bp)
app.register_blueprint(rte_bp)

if __name__ == "__main__":
    app.run(debug=True)

