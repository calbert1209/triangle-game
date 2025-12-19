import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";
import { createTriangle } from "../models/Triangle";
import { GameBoard } from "./GameBoard";
import { GameHeader } from "./Header";

const triangles = Array.from({ length: 15 }).flatMap((_, row) =>
  Array.from({ length: 54 }).map((_, col) => {
    const direction = (col + row) % 2 === 0 ? "up" : "down";
    return createTriangle(row, col, direction);
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
