import {useState} from 'react';
import './App.css';
import {SnakePage} from './snake/snake_page';
import {closeModal} from './utils/modal';
import {SudokuPageReact} from './sudoku/SudokuPageReact';

const SNAKE = 'Snake';
const SUDOKU = 'Sudoku';
const TIC_TAC_TOE = 'Tic Tac Toe';

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  return (
    <>
      <nav id="navBar" className="navbar navbar-expand-sm navbar-dark bg-primary">
        <a id="navBarHeader" className="navbar-brand" href="/">
          Web Games
          {currentGame ? (
            <span id="currentGame">
              {''} - {currentGame}
            </span>
          ) : null}
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="navbarSupportedContent" className="collapse navbar-collapse">
          <ul className="navbar-nav mt-auto mb-auto">
            <li id="gameSelection" className="nav-item dropdown">
              <button
                className="dropdown-toggle btn btn-outline-success"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Select Game...
              </button>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <div className="dropdown-item" onClick={() => setCurrentGame(SNAKE)}>
                  Snake
                </div>
                <div className="dropdown-item" onClick={() => setCurrentGame(SUDOKU)}>
                  Sudoku
                </div>
                <div className="dropdown-item" onClick={() => setCurrentGame(TIC_TAC_TOE)}>
                  Tic Tac Toe
                </div>
              </div>
            </li>

            <GameButtons curreGame={currentGame} />
          </ul>
        </div>
      </nav>

      <div className="container-xl">
        <Content currentGame={currentGame} setCurrentGame={setCurrentGame} />
      </div>

      <div className="modal fade" id="gameOverModal" tabIndex="-1" aria-labelledby="gameOverTitle" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="gameOverTitle"></h5>
              <button
                id="closeGameOverModal"
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => closeModal('gameOverModal')}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p id="gameOverMessage"></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function GameButtons({curreGame}) {
  if (curreGame === SUDOKU) {
    return (
      <>
        <li className="nav-item">
          <div className="nav-link">|</div>
        </li>

        <li className="nav-item">
          <button id="resetBtn" className="btn btn-success">
            Reset
          </button>
        </li>

        <li className="nav-item">
          <button id="hintBtn" className="btn btn-success">
            Get Hint
          </button>
        </li>

        <li id="difficultySelection" className="nav-item dropdown">
          <button
            id="currentDifficulty"
            className="btn btn-outline-success dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Select Difficulty...
          </button>

          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <button id="easy" className="dropdown-item" type="button">
              Easy
            </button>
            <button id="moderate" className="dropdown-item" type="button">
              Moderate
            </button>
            <button id="hard" className="dropdown-item" type="button">
              Hard
            </button>
            <button id="veryHard" className="dropdown-item" type="button">
              Very Hard
            </button>
          </div>
        </li>

        <li>
          <div className="btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-secondary active">
              <input id="showTimerBtn" type="checkbox" autoComplete="off" /> Show Timer
            </label>
          </div>
        </li>
      </>
    );
  }

  return null;
}

function Content({currentGame, setCurrentGame}) {
  if (currentGame === SNAKE) {
    return <SnakePage />;
  }

  if (currentGame === SUDOKU) {
    return <SudokuPageReact />;
  }

  return (
    <div className="row justify-content-center">
      <div className="row justify-content-center w-100 pt-5">
        <h1>Welcome to Web Games!</h1>
      </div>

      <div className="row justify-content-center w-100 align-items-center pt-5">
        <div className="col mx-2">
          <div className="card justify-content-center">
            <img className="card-img-top" src="/images/snake.png" alt="Card image cap" />
            <div className="card-body text-center bg-primary">
              <h5 className="card-title">Snake</h5>
              <button className="btn btn-success" onClick={() => setCurrentGame(SNAKE)}>
                Play!
              </button>
            </div>
          </div>
        </div>
        <div className="col mx-2">
          <div className="card">
            <img className="card-img-top" src="/images/sudoku.png" alt="Card image cap" />
            <div className="card-body text-center bg-primary">
              <h5 className="card-title">Sudoku</h5>
              <button className="btn btn-success" onClick={() => setCurrentGame(SUDOKU)}>
                Play!
              </button>
            </div>
          </div>
        </div>
        <div className="col mx-2">
          <div className="card">
            <img className="card-img-top" src="/images/tic_tac_toe.png" alt="Card image cap" />
            <div className="card-body text-center bg-primary">
              <h5 className="card-title">Tic Tac Toe</h5>
              <button className="btn btn-success" onClick={() => setCurrentGame(TIC_TAC_TOE)}>
                Play!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
