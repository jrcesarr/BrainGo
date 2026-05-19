from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    usuario = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    
    # Relacionamentos: avisa o SQLAlchemy que o usuário tem uma lista de tarefas e finanças
    tarefas = relationship("Tarefa", back_populates="dono", cascade="all, delete-orphan")
    transacoes = relationship("Transacao", back_populates="dono", cascade="all, delete-orphan")

class Tarefa(Base):
    __tablename__ = "tarefase"

    id = Column(Integer, primary_key=True, index=True)
    texto = Column(String, nullable=False)
    concluida = Column(Boolean, default=False)

    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    dono = relationship("Usuario", back_populates="tarefas")

class Transacao(Base):
    __tablename__ = "transacoes"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String, nullable=False)
    valor = Column(Float, nullable=False)
    tipo = Column(String, nullable=False) # 'entrada' ou 'saida'
    
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    
    dono = relationship("Usuario", back_populates="transacoes")