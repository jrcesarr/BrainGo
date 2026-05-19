import React, { useState } from 'react';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Cadastro from './pages/Cadastro/Cadastro';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  // Inicialmente null (nenhum usuário logado)
  const [user, setUser] = useState(null); 

  const logarUsuario = (dadosDoUsuario) => {
    // Aqui guardamos o objeto completinho que veio do FastAPI
    setUser({
      id: dadosDoUsuario.id,
      nome: dadosDoUsuario.usuario
    });
  };

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home onLogin={logarUsuario} />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </BrowserRouter>
    );
  } 

  // O SEGREDO ESTÁ AQUI: 
  //userName precisa receber user.nome (uma string) e NÃO o objeto 'user' inteiro!
  return <Dashboard userName={user.nome} userId={user.id} />;
}

export default App;