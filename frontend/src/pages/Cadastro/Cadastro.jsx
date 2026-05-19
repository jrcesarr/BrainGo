import React, { useState } from 'react';
import BrainInput from '../../components/BrainInput/BrainInput';
import BrainButton from '../../components/BrainButton/BrainButton';
import braingoLogo from '../../assets/braingo_logo.png';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './Cadastro.css';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  // Lembrar de verificar se o nome já existe 

  const handleCadastro = (e) => {
    e.preventDefault(); 
    if (nome.trim() === '' || senha.trim() === '') {
      alert('Escreva em todos os campos!');
      return;
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
            Entrar
          </BrainButton>
        </form>

      </div>
    </div>
  );
}