import {useEffect, useRef} from 'react';
import {SnakeGame} from './snake_game';

export function SnakePage() {
  const game = useRef(new SnakeGame());

  useEffect(() => {
    game.current.init();
  }, []);

  return (
    <div className="row flex-row">
      <div className="row justify-content-around w-100">
        <div className="d-flex flex-column text-center">
          <h2>Current Score</h2>
          <h2 id="currentScore">0</h2>
        </div>

        <div className="d-flex flex-column text-center">
          <h2>High Score</h2>
          <h2 id="highScore" className="fs-1">
            0
          </h2>
        </div>
      </div>

      <div className="row justify-content-center w-100">
        <table id="gameBoardWrapper" />
      </div>

      <div className="row justify-content-center w-100">
        <button
          className="startBtn"
          onClick={(event) => {
            event.target.disabled = true;
            game.current.start(() => (event.target.disabled = false));
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
}
