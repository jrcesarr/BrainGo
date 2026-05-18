import bcrypt

def gerar_hash_senha(senha: str) -> str:
    # Transforma a senha em bytes, gera o salt e cria o hash
    senha_bytes = senha.encode('utf-8')
    salt = bcrypt.gensalt()
    hash_senha = bcrypt.hashpw(senha_bytes, salt)
    
    # Retorna como string normal para salvar no banco de dados
    return hash_senha.decode('utf-8')

def verificar_senha(senha_pura: str, senha_hash: str) -> bool:
    # Compara a senha digitada com o hash salvo
    return bcrypt.checkpw(senha_pura.encode('utf-8'), senha_hash.encode('utf-8'))