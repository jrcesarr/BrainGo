from fastapi import FastAPI
from auth import gerar_hash_senha

app = FastAPI(
    title="BrainGo API",
    description="Backend para gerenciamento de usuários, tarefas e finanças",
    version="1.0.0"
)

@app.get("/")
def home():
    return {"mensagem": "Bem-vindo à API do BrainGo! uhuu 🧠🚀"}

# NOVA ROTA DE TESTE (Apenas para você ver a criptografia funcionar)
@app.get("/teste-criptografia")
def testar_cripto(senha: str):
    senha_protegida = gerar_hash_senha(senha)
    return {
        "senha_original": senha,
        "senha_criptografada_para_o_banco": senha_protegida
    }