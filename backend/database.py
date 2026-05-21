import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. O código tenta puxar a variável que configuramos no Render
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Correção automática caso o Supabase envie "postgres://" (o SQLAlchemy exige "postgresql://")
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
else:
    # Se não achar a variável (significa que você está rodando local no seu PC), usa o SQLite
    SQLALCHEMY_DATABASE_URL = "sqlite:///./braingo.db"

# 2. Configuração do Engine (Atenção ao detalhe do SQLite!)
# O 'check_same_thread' só pode existir se o banco for SQLite. Se for Postgres, quebra.
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()