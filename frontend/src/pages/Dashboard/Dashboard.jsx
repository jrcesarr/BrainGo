import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Importar o Axios
import './Dashboard.css';

// A Dashboard atua como área logada de Tarefas e Finanças, relativas a cada usuário.
export default function Dashboard({ userName, userId }) {
    // Seleciona a Tab visível na Tela (tarefas é a inicial).
    const [activeTab, setActiveTab] = useState('tarefas');
    
    // --- ESTADOS DAS TAREFAS ---
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    // --- ESTADOS DAS FINANÇAS ---
    const [transactions, setTransactions] = useState([]);
    const [finDescription, setFinDescription] = useState('');
    const [finValue, setFinValue] = useState('');
    const [finType, setFinType] = useState('entrada');

    // O useEffect carrega as tarefas e as finanças do banco de dados assim que o usuário entra na tela
    useEffect(() => {
        const carregarDadosdoBanco = async () => {
          if (!userId) return;
          try {
            
            // Busca as tarefas
            const resTarefas = await axios.get(`http://127.0.0.1:8000/tarefas/${userId}`)
            setTasks(resTarefas.data);

            // Busca as finanças
            const resFinancas = await axios.get(`http://127.0.0.1:8000/transacoes/${userId}`)
            setTransactions(resFinancas.data);

          } catch (erro) {
            console.error("Erro ao carregar os dados", erro);
          }
        }

        carregarDadosDoBanco();
    }, [userId]);

    // Adiciona a tarefa no SQLite
    const addTask = async () => {
        if (newTask.trim() === '') return;
        
        try {
            const resposta = await axios.post("http://127.0.0.1:8000/tarefas/", {
                texto: newTask,
                usuario_id: userId // Enviando o dono da tarefa
            });

            // Adiciona na lista do React o item que acabou de ser gerado pelo banco (com ID real)
            setTasks([...tasks, resposta.data]);
            setNewTask('');
        } catch (erro) {
            alert("Não foi possível salvar a tarefa no servidor.");
        }
    };

    // Alterna o status (concluída/pendente) no SQLite
    const toggleTask = async (id) => {
        try {
            // Dispara a rota PUT  para inverter o status
            const resposta = await axios.put(`http://127.0.0.1:8000/tarefas/${id}/toggle`);
            
            // Atualiza o estado do React com os dados modificados vindos do Backend
            setTasks(tasks.map(t => t.id === id ? resposta.data : t));
        } catch (erro) {
            alert("Não foi possível atualizar o status da tarefa.");
        }
    };

    // --- MANIPULAÇÃO FINANCEIRA (Continua local por enquanto) ---
    const addTransaction = (e) => {
        e.preventDefault();
        if (finDescription.trim() === '' || finValue === '') return;

        const novaTransacao = {
            id: Date.now(),
            description: finDescription,
            value: parseFloat(finValue), 
            type: finType
        };

        setTransactions([...transactions, novaTransacao]);
        setFinDescription('');
        setFinValue('');
    };

    const saldoTotal = transactions.reduce((acumulador, atual) => {
        if (atual.type === 'entrada') {
            return acumulador + atual.value;
        } else {
            return acumulador - atual.value;
        }
    }, 0);

    return (
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1>Olá, {userName}!</h1>
            <p>{activeTab === 'tarefas' ? 'Organize suas tarefas do dia' : 'Gerencie suas finanças'}</p>
          </header>

          <main className="dashboard-content">
            {/* Navegação por Abas */}
            <div className="tab-navigation">
              <button 
                className={`tab-button ${activeTab === 'tarefas' ? 'active-tasks' : ''}`}
                onClick={() => setActiveTab('tarefas')}
              >
                Tarefas
              </button>
              <button 
                className={`tab-button ${activeTab === 'financas' ? 'active-finance' : ''}`}
                onClick={() => setActiveTab('financas')}
              >
                Finanças
              </button>
            </div>

            {/* ABA DE TAREFAS */}
            {activeTab === 'tarefas' && (
              <div className="tasks-card">
                <div className="card-header">
                  <h3>Minhas Tarefas</h3>
                  <span>{tasks.filter(t => t.concluida).length}/{tasks.length} completas</span>
                </div>

                <div className="task-input-container">
                  <input 
                    type="text" 
                    placeholder="Nova tarefa..." 
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                  <button onClick={addTask}>+</button>
                </div>

                <div className="task-list">
                  {tasks.length === 0 ? (
                    <p className="empty-message">Nenhuma tarefa ainda. Adicione uma!</p>
                  ) : (
                    tasks.map(task => (
                      <div 
                        key={task.id} 
                        className={`task-item ${task.concluida ? 'completed' : ''}`}
                        onClick={() => toggleTask(task.id)}
                      >
                        <input type="checkbox" checked={task.concluida} readOnly />
                        <span>{task.texto}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ABA DE FINANÇAS */}
            {activeTab === 'financas' && (
              <div className="finance-card">
                <div className={`balance-box ${saldoTotal >= 0 ? 'positive' : 'negative'}`}>
                  <span>Saldo Atual</span>
                  <h2>R$ {saldoTotal.toFixed(2)}</h2>
                </div>

                <form onSubmit={addTransaction} className="finance-form">
                  <input 
                    type="text" 
                    placeholder="Descrição (ex: Salário, Lanche...)" 
                    value={finDescription}
                    onChange={(e) => setFinDescription(e.target.value)}
                    required
                  />
                  
                  <div className="finance-row">
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="Valor (R$)" 
                      value={finValue}
                      onChange={(e) => setFinValue(e.target.value)}
                      required
                    />
                    
                    <select value={finType} onChange={(e) => setFinType(e.target.value)}>
                      <option value="entrada">Entrada (+)</option>
                      <option value="saida">Saída (-)</option>
                    </select>
                  </div>

                  <button type="submit" className="finance-submit-btn">
                    Adicionar Registro
                  </button>
                </form>

                <div className="transaction-list">
                  <h3>Histórico</h3>
                  {transactions.length === 0 ? (
                    <p className="empty-message">Nenhum movimento registrado.</p>
                  ) : (
                    transactions.map(t => (
                      <div key={t.id} className={`transaction-item ${t.type}`}>
                        <span>{t.description}</span>
                        <strong>
                          {t.type === 'entrada' ? '+' : '-'} R$ {t.value.toFixed(2)}
                        </strong>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
    );
}