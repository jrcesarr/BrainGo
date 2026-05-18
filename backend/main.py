from fastapi import FastAPI

app = FastAPI(
    title="BrainGo API",
    description="Backend para gerenciamento de usuários, tarefas e finanças",
    version="1.0.0"
)

@app.get("/")
def home():
    return {"mensagem": "Bem-vindo à API do BrainGo! 🧠🚀"}