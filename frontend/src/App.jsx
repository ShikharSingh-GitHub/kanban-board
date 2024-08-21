import React from 'react';
import './App.css';
import Board from './components/Board';

const App = React.memo(() => {
  return (
    <div className="app">
      <header>
        <h1>Kanban Board</h1>
      </header>
      <main>
        <Board />
      </main>
    </div>
  );
});

export default App;
