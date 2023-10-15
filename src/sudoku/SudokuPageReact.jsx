import {useEffect, useRef} from 'react';
import {SudokuPage} from './sudoku_page';

export function SudokuPageReact() {
  const game = useRef(null);

  useEffect(() => {
    if (game.current === null) {
      game.current = new SudokuPage();
    }
  }, []);

  return (
    <div className="row flex-row pt-5">
      <div className="row justify-content-center w-100">
        <h2 id="timer" hidden>
          Time: <span id="elapsedTime"></span>s
        </h2>
      </div>

      <div className="row justify-content-center w-100 pt-5">
        <table id="gameBoardWrapper" />
      </div>
    </div>
  );
}
