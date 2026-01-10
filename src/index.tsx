import { render } from "preact";
import "./style.css";
import { TriangleGame } from "./models/Game";
import { useState } from "preact/hooks";
import { Client } from "boardgame.io/react";
import { GameSurface } from "./components/GameSurface";

const TwoPlayerGame = Client({
  numPlayers: 2,
  game: TriangleGame,
  board: GameSurface,
});

const ThreePlayerGame = Client({
  numPlayers: 3,
  game: TriangleGame,
  board: GameSurface,
});

const Foo = () => {
  const [threePlayerGame, setThreePlayerGame] = useState(false);
  const [picked, setPicked] = useState(false);

  const startGame = (hasThreePlayers: boolean) => {
    setThreePlayerGame(hasThreePlayers);
    setPicked(true);
  };

  return (
    <div>
      {picked ? (
        <>{threePlayerGame ? <ThreePlayerGame /> : <TwoPlayerGame />}</>
      ) : (
        <>
          <button onClick={() => startGame(false)}>2 Players</button>
          <button onClick={() => startGame(true)}>3 Players</button>
        </>
      )}
    </div>
  );
};

render(<Foo />, document.getElementById("app"));
