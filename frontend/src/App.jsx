import React, { useState } from 'react';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Cadastro from './pages/Cadastro/Cadastro';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {

<BrowserRouter>
    <Routes>
      {/* Rota do Login*/}
      <Route path="/" element={<Home/>} />
        
      {/* Rota do Cadastro */}
      <Route path="/cadastro" element={<Cadastro/>} />
    </Routes>
  </BrowserRouter>

  const [user, setUser] = useState(null); // Inicialmente, não há ninguém logado;

  if(!user){
    // Verifica se foi realizado o Login em Home
    return (
      <BrowserRouter>
        <Routes>
          {/* Rota da Home (Login) */}
          <Route path="/" element={<Home onLogin={(nomeDigitado) => setUser(nomeDigitado)} />} />
          
          {/* Rota do Cadastro */}
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </BrowserRouter>
    );
  } 

  return <Dashboard userName={user} />;

}

export default App;
