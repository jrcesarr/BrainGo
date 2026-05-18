import React, { useState } from 'react';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  const [user, setUser] = useState(null); // Inicialmente, não há ninguém logado;

  if(!user){
    // Verifica se foi realizado o Login em Home
    return (
      <Home onLogin={(nomeDigitado) => setUser(nomeDigitado)}/>
    );
  } 

  return <Dashboard userName={user} />;

}

export default App;
