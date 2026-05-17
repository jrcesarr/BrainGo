import React, { useState } from 'react';
import BrainInput from '../../components/BrainInput/BrainInput';
import BrainButton from '../../components/BrainButton/BrainButton';
import './Home.css';

export default function Home() {
  const [nome, setNome] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); // Evita que a página recarregue ao submeter o formulário
    if (nome.trim() === '') {
      alert('Por favor, introduza o seu nome para começar!');
      return;
    }
    
    // Por enquanto mostra o alerta. Depois vamos navegar para o Dashboard!
    alert(`Bem-vindo ao BrainGo, ${nome}!`);
  };

  return (
    <div className="home-page-container">
      <div className="mobile-card">
        
        {/* Topo / Branding */}
        <div className="home-header">
          <div className="brain-logo">🧠</div>
          <h1>BrainGo</h1>
          <p>Organize a sua mente, as suas tarefas e o seu bolso.</p>
        </div>

        {/* Formulário de Entrada */}
        <form onSubmit={handleLogin} className="home-form">
          <BrainInput 
            label="Como quer ser chamado?" 
            placeholder="Digite o seu nome..." 
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          
          <BrainButton type="submit">
            Começar Jornada
          </BrainButton>
        </form>

      </div>
    </div>
  );
}