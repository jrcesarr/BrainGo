from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

import models
import auth
from database import engine, SessionLocal

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",  # React puro
    "http://localhost:5173",  # Vite (React/Vue)
    "http://127.0.0.1:5500",  # Live Server do VS Code (HTML puro)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Permite os sites da lista acima
    allow_credentials=True,
    allow_methods=["*"],         # Permite POST, GET, PUT, DELETE, etc.
    allow_headers=["*"],         # Permite qualquer cabeçalho de envio
)

# 1. Cria as tabelas no banco de dados
models.Base.metadata.create_all(bind=engine)

# 2. Define o "molde" dos dados que vamos receber do frontend/usuário
class UsuarioCriar(BaseModel):
    usuario: str
    senha: str

# 3. Função padrão para abrir a conexão com o banco e fechar logo depois
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 4. A rota oficial de Cadastro
@app.post("/usuarios/")
def registrar_usuario(novo_usuario: UsuarioCriar, db: Session = Depends(get_db)):
    
    # Passo A: Verifica se já existe alguém com esse nome no banco
    usuario_existente = db.query(models.Usuario).filter(models.Usuario.usuario == novo_usuario.usuario).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Esse nome de usuário já está em uso.")

    # Passo B: Criptografa a senha pura que o usuário digitou
    senha_protegida = auth.gerar_hash_senha(novo_usuario.senha)

    # Passo C: Monta o "pacote" do usuário do jeito que o banco de dados espera
    usuario_db = models.Usuario(usuario=novo_usuario.usuario, senha_hash=senha_protegida)

    # Passo D: Salva efetivamente no banco
    db.add(usuario_db)
    db.commit()
    db.refresh(usuario_db) # Atualiza o objeto com o ID gerado pelo banco

    # Retorna uma mensagem de sucesso, escondendo a senha e o hash por segurança
    return {
        "mensagem": "Usuário criado com sucesso!", 
        "id": usuario_db.id, 
        "usuario": usuario_db.usuario
    }