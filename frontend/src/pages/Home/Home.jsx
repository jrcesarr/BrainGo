import React, { useState } from 'react';
import BrainInput from '../../components/BrainInput/BrainInput';
import BrainButton from '../../components/BrainButton/BrainButton';
import braingoLogo from '../../assets/braingo_logo.png';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

export default function Home( {onLogin} ) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); 
    if (nome.trim() === '' || senha.trim() === '') {
      alert('Por favor, introduza seu nome e sua senha para começar!');
      return;
    }
    
    try {
      // 3. Chamar a API de login enviando os dados digitados
      const resposta = await axios.post("http://127.0.0.1:8000/login", {
        usuario: nome,
        senha: senha
      });

      // 4. Se o login funcionar, acionamos a sua função onLogin passando o nome
      // No futuro, podemos passar o ID também: resposta.data.id
      onLogin(resposta.data.usuario);

    } catch (erro) {
      // 5. Captura erros (ex: usuário ou senha errados) enviados pelo FastAPI
      if (erro.response && erro.response.data) {
        alert(erro.response.data.detail);
      } else {
        alert("Não foi possível conectar ao servidor.");
      }
    }
    
  };

  return (
    <div className="home-page-container">
      <div className="mobile-card">
        
        {/* Cabeçalho */}
        <div className="home-header">
          <div className="brain-logo">
            <img 
              src={braingoLogo} 
              alt="Logo BrainGo" 
              className="brain-logo-img jumping-logo" 
            />
          </div>
          <h1>BrainGo</h1>
          <p>Organize a sua mente, as suas tarefas e o seu bolso.</p>
        </div>

        {/* Formulário de Entrada */}
        <form onSubmit={handleLogin} className="home-form">
          <BrainInput 
            label="Insira o nome e a senha para o login" 
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
            Entrar
          </BrainButton>
        </form>

        <div className="home-cadastro">
          <p>Ainda não tem conta?</p>
          <Link to="/cadastro">
            Cadastre-se aqui!
          </Link>
        </div>

      </div>
    </div>
  );
}