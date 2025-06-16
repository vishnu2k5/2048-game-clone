import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState(Array(4).fill(null).map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize board with 2 tiles
  useEffect(() => {
    let newBoard = [...board];
    addNewTile(newBoard);
    addNewTile(newBoard);
    setBoard(newBoard);
  }, []);

  //finds a empty space with 0 fills it with 4 or 2
  const addNewTile = (board) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) return;

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
  };

  //key maping
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        moveUp();
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      default:
        return;
    }
    e.preventDefault();
  };


  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board]);

  //key functions
  const moveLeft = () => {
    let moved = false;
    let newBoard = board.map(row => {
      let filteredRow = row.filter(val => val !== 0);
      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          filteredRow[i + 1] = 0;
          moved = true;
        }
      }
      filteredRow = filteredRow.filter(val => val !== 0);
      while (filteredRow.length < 4) filteredRow.push(0);
      return filteredRow;
    });

    if (moved || JSON.stringify(board) !== JSON.stringify(newBoard)) {
      setBoard(newBoard);
      addNewTile(newBoard);
      setBoard([...newBoard]);
    }
  };

  const moveRight = () => {
    let moved = false;
    let newBoard = board.map(row => {
      let filteredRow = row.filter(val => val !== 0);
      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          filteredRow[i - 1] = 0;
          moved = true;
        }
      }
      filteredRow = filteredRow.filter(val => val !== 0);
      while (filteredRow.length < 4) filteredRow.unshift(0);
      return filteredRow;
    });

    if (moved || JSON.stringify(board) !== JSON.stringify(newBoard)) {
      setBoard(newBoard);
      addNewTile(newBoard);
      setBoard([...newBoard]);
    }
  };

  const moveUp = () => {
    let moved = false;
    let newBoard = transpose(board);
    newBoard = newBoard.map(col => {
      let filteredCol = col.filter(val => val !== 0);
      for (let i = 0; i < filteredCol.length - 1; i++) {
        if (filteredCol[i] === filteredCol[i + 1]) {
          filteredCol[i] *= 2;
          filteredCol[i + 1] = 0;
          moved = true;
        }
      }
      filteredCol = filteredCol.filter(val => val !== 0);
      while (filteredCol.length < 4) filteredCol.push(0);
      return filteredCol;
    });
    newBoard = transpose(newBoard);

    if (moved || JSON.stringify(board) !== JSON.stringify(newBoard)) {
      setBoard(newBoard);
      addNewTile(newBoard);
      setBoard([...newBoard]);
    }
  };

  const moveDown = () => {
    let moved = false;
    let newBoard = transpose(board);
    newBoard = newBoard.map(col => {
      let filteredCol = col.filter(val => val !== 0);
      for (let i = filteredCol.length - 1; i > 0; i--) {
        if (filteredCol[i] === filteredCol[i - 1]) {
          filteredCol[i] *= 2;
          filteredCol[i - 1] = 0;
          moved = true;
        }
      }
      filteredCol = filteredCol.filter(val => val !== 0);
      while (filteredCol.length < 4) filteredCol.unshift(0);
      return filteredCol;
    });
    newBoard = transpose(newBoard);

    if (moved || JSON.stringify(board) !== JSON.stringify(newBoard)) {
      setBoard(newBoard);
      addNewTile(newBoard);
      setBoard([...newBoard]);
    }
  };

  const transpose = (matrix) => {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  };
  //game over cheaker 
  const checkGameOver = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) return false;
      if (i < 3 && board[i][j] === board[i + 1][j]) return false;
      if (j < 3 && board[i][j] === board[i][j + 1]) return false;
    }
  }
  return true;
};
useEffect(() => {
  if (checkGameOver()) {
    setGameOver(true);
  }
}, [board]);
//if you win game
const checkWin = () => {
  return board.some(row => row.includes(2048));
};

//reset button 
const restartGame = () => {
  const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
  addNewTile(newBoard);
  addNewTile(newBoard);
  setBoard(newBoard);
  setGameOver(false);
  setScore(0);
};

  return (
    <div className="game">
      <h1>2048 Clone</h1>
      {gameOver && <h2 style={{ color: 'red' }}>Game Over!</h2>}
      {checkWin() && <h2 style={{ color: 'green' }}>You Win!</h2>}
      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((tile, j) => (
              <div key={j} className={`tile tile-${tile}`}>
                {tile !== 0 && tile}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="restart-button" onClick={restartGame}>Restart</button>
      {/* <button onClick={() => window.location.reload()}>Restart</button>  i wouldent prefore cause it reloads ur browser */}
    </div>
  );
}

export default App;