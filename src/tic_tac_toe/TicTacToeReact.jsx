import {useEffect, useRef} from 'react';
import {TicTacToePage} from './tic_tac_toe_page';

export function TicTacToeReact() {
  const game = useRef(null);

  useEffect(() => {
    if (game.current === null) {
      game.current = new TicTacToePage();
    }
  }, []);

  return (
    <div className="row flex-row pt-5">
      <div className="row justify-content-around w-100">
        <div className="d-flex flex-column text-center">
          <h2>Wins</h2>
          <h2 id="humanWins">0</h2>
        </div>

        <div className="d-flex flex-column text-center">
          <h2>Losses</h2>
          <h2 id="compWins">0</h2>
        </div>
      </div>

      <div className="row justify-content-center w-100 pt-5">
        <table id="gameBoardWrapper" />
      </div>
    </div>
  );
}
