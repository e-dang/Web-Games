import {useEffect, useRef} from 'react';
import {SnakePage} from './snake_page';

export function SnakePageReact() {
  const game = useRef(null);

  useEffect(() => {
    if (game.current === null) {
      game.current = new SnakePage();
    }
  }, []);

  return (
    <div className="row flex-row pt-5">
      <div className="row justify-content-around w-100">
        <div className="d-flex flex-column text-center">
          <h2>Current Score</h2>
          <h2 id="currentScore">0</h2>
        </div>

        <div className="d-flex flex-column text-center">
          <h2>High Score</h2>
          <h2 id="highScore">0</h2>
        </div>
      </div>

      <div className="row justify-content-center w-100 pt-5">
        <table id="gameBoardWrapper" />
      </div>
    </div>
  );
}
