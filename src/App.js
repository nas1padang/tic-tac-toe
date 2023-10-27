
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function restart() {
    setSquares(Array(9).fill(null));
  }

  return (
    <GameContext.Provider value={{ squares, setSquares, restart }}>
      {children}
    </GameContext.Provider>
  );
}



function Board() {
  const { squares, setSquares } = useGame();

  const nextValue = calculateNextValue(squares);
  const winner = calculateWinner(squares);
  const status = calculateStatus(winner, squares, nextValue);

  function selectSquare(square) {
    if (squares[square] || winner) return; // If square is already filled or if there's a winner, return
    const squaresCopy = [...squares];
    squaresCopy[square] = nextValue;
    setSquares(squaresCopy);
  }

  function renderSquare(i) {
    return (
      <button 
        className="square w-16 h-16 border border-gray-400 flex items-center justify-center text-2xl hover:bg-gray-200 transition duration-150" 
        onClick={() => selectSquare(i)}
        key={i}
      >
        {squares[i]}
      </button>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <div className="mb-4 text-lg font-semibold">{status}</div>
      <div className="grid grid-cols-3 gap-2">
        {Array(9).fill(null).map((_, index) => renderSquare(index))}
      </div>
    </div>
  );
}

function Game() {
  const { restart } = useGame();

  return (
    <div className="p-4 flex flex-col items-center">
      <Board />
      <button 
        onClick={restart}
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded shadow-md transition duration-150"
      >
        Reset
      </button>
    </div>
  );
}



// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`;
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <GameProvider>
        <Game />
      </GameProvider>
    </div>
  );
}



export default App;
