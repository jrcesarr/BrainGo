import React, { useState } from 'react';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Cadastro from './pages/Cadastro/Cadastro';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* O App.jsx gerencia o estado global de autenticação */

function App() {
  const [user, setUser] = useState(null); 

  const logarUsuario = (dadosDoUsuario) => {
    // Objeto do FastApi
    setUser({
      id: dadosDoUsuario.id,
      nome: dadosDoUsuario.usuario
    });
  };

  // Se o usuário for nulo, o usuário fica restrito às rotas públicas de login e cadastro
  // No caso da tela de  login, a função logarUsuario torna-se uma prop chamada onLogin dentro de Home

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

  // Existindo o usuário, a tela de Dashboard é renderizada
  return <Dashboard userName={user.nome} userId={user.id} />;
}

export default App;