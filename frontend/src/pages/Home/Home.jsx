import React, { useState } from 'react';
import BrainInput from '../../components/BrainInput/BrainInput';
import BrainButton from '../../components/BrainButton/BrainButton';
import braingoLogo from '../../assets/braingo_logo.png';
import './Home.css';

export default function Home() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); 
    if (nome.trim() === '' || senha.trim() === '') {
      alert('Por favor, introduza seu nome e sua senha para começar!');
      return;
    }
    
    // Por enquanto mostra o alerta.
    alert(`Bem-vindo ao BrainGo, ${nome}!. Sua senha é ${senha}!`);
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

      </div>
    </div>
  );
}