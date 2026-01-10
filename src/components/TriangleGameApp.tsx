import { Fragment } from "preact";
import { TriangleGame } from "../models/Game";
import { useMemo } from "preact/hooks";
import { Client } from "boardgame.io/react";
import { GameSurface } from "./GameSurface";

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

export const TriangleGameApp = () => {
  const threePlayerGame = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const searchValue = params.get("players") === "3";
    console.log("searchValue", searchValue);
    return searchValue;
  }, [window.location.search]);

  return (
    <Fragment key={threePlayerGame}>
      {threePlayerGame ? <ThreePlayerGame /> : <TwoPlayerGame />}
    </Fragment>
  );
};
