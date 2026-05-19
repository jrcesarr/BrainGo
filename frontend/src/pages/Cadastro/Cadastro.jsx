import React, { useState } from 'react';
import BrainInput from '../../components/BrainInput/BrainInput';
import BrainButton from '../../components/BrainButton/BrainButton';
import braingoLogo from '../../assets/braingo_logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cadastro.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault(); 

    if (nome.trim() === '' || senha.trim() === '') {
        alert('Escreva em todos os campos!');
        return;
    }

    try {
      // 3. Disparamos o POST para o FastAPI
      // Lembra que o FastAPI espera a chave "usuario", então passamos o nosso estado "nome" para ela
        const resposta = await axios.post("http://127.0.0.1:8000/usuarios/", {
        usuario: nome,
        senha: senha
        });

      // Se deu certo, entra aqui:
        alert(resposta.data.mensagem); // Vai mostrar "Usuário criado com sucesso!"
        navigate("/");

        // Opcional: Limpar os campos após o cadastro
        setNome('');
        setSenha('');

      

    } catch (erro) {
        // 4. Se o FastAPI der erro (tipo o Erro 400 de usuário já existente), cai aqui:
        if (erro.response && erro.response.data) {
            // Mostra o erro exato que colocamos no FastAPI ("Esse nome de usuário já está em uso.")
            alert(erro.response.data.detail);
        } else {
            alert("Não foi possível conectar ao servidor.");
        }
    }

  };

  return (
    <div className="cadastro-page-container">
      <div className="mobile-card">
        
        {/* Cabeçalho */}
        <div className="cadastro-header">
          <div className="brain-logo">
            <img 
              src={braingoLogo} 
              alt="Logo BrainGo" 
              className="brain-logo-img jumping-logo" 
            />
          </div>
          <h1>BrainGo</h1>
        </div>

        {/* Formulário de Entrada */}
        <form onSubmit={handleCadastro} className="cadastro-form">
          <BrainInput 
            label="Insira o nome e a senha para o cadastro" 
            placeholder="Digite o seu nome..." 
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <BrainInput 
            label="" 
            placeholder="Digite a sua senha..." 
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        
          <BrainButton type="submit">
            Cadastrar
          </BrainButton>
        </form>

      </div>
    </div>
  );
}