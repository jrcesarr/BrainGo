from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define onde o arquivo do banco de dados vai ser criado
SQLALCHEMY_DATABASE_URL = "sqlite:///./braingo.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Cria uma fábrica de sessões (para podermos conversar com o banco a cada requisição)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe base que usaremos para criar as nossas tabelas/modelos
Base = declarative_base()