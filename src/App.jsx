import './App.css';
import {SnakePage} from './snake/snake_page';
import {closeModal} from './utils/modal';

function App() {
  return (
    <>
      <div className="container-xl">
        <SnakePage />
      </div>

      <div className="modal fade" id="gameOverModal" tabIndex="-1" aria-labelledby="gameOverTitle" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="gameOverTitle"></h5>
              <button id="closeGameOverModal" type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" onClick={() => closeModal('gameOverModal')}>
                  &times;
                </span>
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

export default App;
