import {useState} from 'react';
import './App.css';
import {SnakePage} from './snake/snake_page';
import {closeModal} from './utils/modal';

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

function Content({currentGame, setCurrentGame}) {
  if (currentGame === SNAKE) {
    return <SnakePage />;
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
