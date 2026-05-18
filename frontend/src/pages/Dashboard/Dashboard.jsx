import React, { useState } from 'react';
import './Dashboard.css';

export default function Dashboard({ userName }) {
    const [activeTab, setActiveTab] = useState('tarefas');
    const [tasks, setTasks] = useState([]); // guarda as tasks prontas
    const [newTask, setNewTask] = useState(''); // guarda o texto do momento

    const addTask = () => {
        if (newTask.trim() === '') return;
        const item = { 
            id: Date.now(), 
            text: newTask, 
            completed: false 
        };
        setTasks([...tasks, item]);
        setNewTask('');
    };
    
    return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Olá, {userName}!</h1>
        <p>{activeTab === 'tarefas' ? 'Organize suas tarefas do dia' : 'Gerencie suas finanças'}</p>
      </header>

      <main className="dashboard-content">
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
                  <div key={task.id} className="task-item">
                    {task.text}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};


