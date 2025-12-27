import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";
import { createTriangle } from "../models/Triangle";
import { GameBoard } from "./GameBoard";
import { GameHeader } from "./Header";

export const BOARD_ROWS = 15;
export const BOARD_COLS = 54;

const triangles = Array.from({ length: BOARD_ROWS }).flatMap((_, row) =>
  Array.from({ length: BOARD_COLS }).map((_, col) => {
    return createTriangle(row, col);
  })
);

interface GameSurfaceProps extends BoardProps<TriangleGameState> {}

export const GameSurface = (props: GameSurfaceProps) => {
  return (
    <div>
      <header>
        <GameHeader />
      </header>
      <main>
        <GameBoard {...props} triangles={triangles} />
      </main>
    </div>
  );
};
