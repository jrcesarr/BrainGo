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
    allow_origins=["*"],       # Permite os sites da lista acima quando o valor é origins. Deixando o padrão * para facilitar o deploy
    allow_credentials=True,
    allow_methods=["*"],         # Permite POST, GET, PUT, DELETE, etc.
    allow_headers=["*"],         # Permite qualquer cabeçalho de envio
)

# 1. Cria as tabelas no banco de dados
models.Base.metadata.create_all(bind=engine)

# 2. molde do frontend/usuário
class UsuarioCriar(BaseModel):
    usuario: str
    senha: str

# moldes para as Tarefas
class TarefaCriar(BaseModel):
    texto: str
    usuario_id: int  # O React vai enviar o ID de quem está logado

class TarefaResposta(BaseModel):
    id: int
    texto: str
    concluida: bool
    usuario_id: int
    class Config:
        from_attributes = True

# Novos moldes para as Finanças
class TransacaoCriar(BaseModel):
    descricao: str
    valor: float
    tipo: str  # 'entrada' ou 'saida'
    usuario_id: int

class TransacaoResposta(BaseModel):
    id: int
    descricao: str
    valor: float
    tipo: str
    usuario_id: int
    class Config:
        from_attributes = True

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

@app.post("/login")
def login_usuario(dados_login: UsuarioCriar, db: Session = Depends(get_db)):
    # 1. Busca o usuário no banco pelo nome digitado
    usuario_db = db.query(models.Usuario).filter(models.Usuario.usuario == dados_login.usuario).first()
    
    # 2. Se o usuário não existir, trava aqui
    if not usuario_db:
        raise HTTPException(status_code=400, detail="Usuário ou senha incorretos.")
    
    # 3. Usa a função do bcrypt para comparar a senha pura com o hash do banco
    senha_correta = auth.verificar_senha(dados_login.senha, usuario_db.senha_hash)
    
    # 4. Se a senha estiver errada, trava aqui
    if not senha_correta:
        raise HTTPException(status_code=400, detail="Usuário ou senha incorretos.")
    
    # 5. Se passou por tudo, o login deu certo! Retornamos os dados dele
    return {
        "mensagem": "Login realizado com sucesso!",
        "id": usuario_db.id,
        "usuario": usuario_db.usuario
    }

# --- ROTAS DE TAREFAS ---

# 1. Buscar todas as tarefas de um usuário específico
@app.get("/tarefas/{usuario_id}", response_model=list[TarefaResposta])
def listar_tarefas(usuario_id: int, db: Session = Depends(get_db)):
    return db.query(models.Tarefa).filter(models.Tarefa.usuario_id == usuario_id).all()

# 2. Criar uma nova tarefa
@app.post("/tarefas/", response_model=TarefaResposta)
def criar_tarefa(nova_tarefa: TarefaCriar, db: Session = Depends(get_db)):
    tarefa_db = models.Tarefa(texto=nova_tarefa.texto, usuario_id=nova_tarefa.usuario_id)
    db.add(tarefa_db)
    db.commit()
    db.refresh(tarefa_db)
    return tarefa_db

# 3. Inverter o status de concluída da tarefa
@app.put("/tarefas/{tarefa_id}/toggle", response_model=TarefaResposta)
def alternar_tarefa(tarefa_id: int, db: Session = Depends(get_db)):
    tarefa_db = db.query(models.Tarefa).filter(models.Tarefa.id == tarefa_id).first()
    if not tarefa_db:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    tarefa_db.concluida = not tarefa_db.concluida  # Inverte o valor booleano
    db.commit()
    db.refresh(tarefa_db)
    return tarefa_db

# 4. Deletar uma tarefa
@app.delete("/tarefas/{tarefa_id}")
def deletar_tarefa(tarefa_id: int, db: Session = Depends(get_db)):
    tarefas_db = db.query(models.Tarefa).filter(models.Tarefa.id == tarefa_id).first()
    if not tarefas_db:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    
    db.delete(tarefas_db)
    db.commit()
    return {"mensagem": "Registro deletado com sucesso!"}

# --- ROTAS DE FINANÇAS (TRANSAÇÕES) ---

# 1. Buscar todo o histórico financeiro de um usuário específico
@app.get("/transacoes/{usuario_id}", response_model=list[TransacaoResposta])
def listar_transacoes(usuario_id: int, db: Session = Depends(get_db)):
    return db.query(models.Transacao).filter(models.Transacao.usuario_id == usuario_id).all()

# 2. Criar um novo registro financeiro (Entrada ou Saída)
@app.post("/transacoes/", response_model=TransacaoResposta)
def criar_transacao(nova_transacao: TransacaoCriar, db: Session = Depends(get_db)):
    transacao_db = models.Transacao(
        descricao=nova_transacao.descricao,
        valor=nova_transacao.valor,
        tipo=nova_transacao.tipo,
        usuario_id=nova_transacao.usuario_id
    )
    db.add(transacao_db)
    db.commit()
    db.refresh(transacao_db)
    return transacao_db

# 3. Deletar um registro financeiro (Opcional, mas muito útil!)
@app.delete("/transacoes/{transacao_id}")
def deletar_transacao(transacao_id: int, db: Session = Depends(get_db)):
    transacao_db = db.query(models.Transacao).filter(models.Transacao.id == transacao_id).first()
    if not transacao_db:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    
    db.delete(transacao_db)
    db.commit()
    return {"mensagem": "Registro deletado com sucesso!"}