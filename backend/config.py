class Config:
    SECRET_KEY = "Gauri"
    SQLALCHEMY_DATABASE_URI = "sqlite:///events.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE ='filesystem'