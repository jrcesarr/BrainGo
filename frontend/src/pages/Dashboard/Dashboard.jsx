import React, { useState } from 'react';
import './Dashboard.css';

export default function Dashboard({ userName }) {
    const [activeTab, setActiveTab] = useState('tarefas');
    
    // --- ESTADOS DAS TAREFAS ---
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    // --- ESTADOS DAS FINANÇAS ---
    const [transactions, setTransactions] = useState([]);
    const [finDescription, setFinDescription] = useState('');
    const [finValue, setFinValue] = useState('');
    const [finType, setFinType] = useState('entrada'); // 'entrada' ou 'saida'

    // Função para adicionar tarefa
    const addTask = () => {
        if (newTask.trim() === '') return;
        const item = { id: Date.now(), text: newTask, completed: false };
        setTasks([...tasks, item]);
        setNewTask('');
    };

    // Função para inverter o status da tarefa (completar/descompletar)
    const toggleTask = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    // Função para adicionar movimentação financeira
    const addTransaction = (e) => {
        e.preventDefault();
        if (finDescription.trim() === '' || finValue === '') return;

        const novaTransacao = {
            id: Date.now(),
            description: finDescription,
            // Força o valor a ser um número decimal flutuante
            value: parseFloat(finValue), 
            type: finType
        };

        setTransactions([...transactions, novaTransacao]);
        setFinDescription('');
        setFinValue('');
    };

    // Lógica para calcular o Saldo Total
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
                  <span>{tasks.filter(t => t.completed).length}/{tasks.length} completas</span>
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
                        className={`task-item ${task.completed ? 'completed' : ''}`}
                        onClick={() => toggleTask(task.id)}
                      >
                        <input type="checkbox" checked={task.completed} readOnly />
                        <span>{task.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ABA DE FINANÇAS */}
            {activeTab === 'financas' && (
              <div className="finance-card">
                
                {/* Visor de Saldo */}
                <div className={`balance-box ${saldoTotal >= 0 ? 'positive' : 'negative'}`}>
                  <span>Saldo Atual</span>
                  <h2>R$ {saldoTotal.toFixed(2)}</h2>
                </div>

                {/* Formulário de Gastos/Ganhos */}
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

                {/* Histórico Financeiro */}
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

