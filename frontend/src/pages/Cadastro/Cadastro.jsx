import React, { useState } from 'react';
import BrainInput from '../../components/BrainInput/BrainInput';
import BrainButton from '../../components/BrainButton/BrainButton';
import braingoLogo from '../../assets/braingo_logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cadastro.css';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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
        // Chama a API de usuários para cadastrarmento
        const resposta = await axios.post(`${API_URL}/cadastro`, {
        usuario: nome,
        senha: senha
        });

        alert(resposta.data.mensagem); // Mostra "Usuário criado com sucesso!" do Main.py
        navigate("/");

        // Limpa os campos após o cadastro
        setNome('');
        setSenha('');

      

    } catch (erro) {
        if (erro.response && erro.response.data) {
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

         <div className="cadastro-home">
            <p>Já possui uma conta?</p>
            <Link to="/">
                Entre aqui!
            </Link>
        </div>

      </div>
    </div>
  );
}