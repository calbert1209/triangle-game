import { createTriangle } from "../models/Triangle";
import { GameBoard } from "./GameBoard";
import { GameHeader } from "./Header";

const triangles = Array.from({ length: 18 }).flatMap((_, row) =>
  Array.from({ length: 50 }).map((_, col) => {
    const direction = (col + row) % 2 === 0 ? "up" : "down";
    return createTriangle(row, col, direction);
  })
);

export const App = () => {
  return (
    <div>
      <header>
        <GameHeader />
      </header>
      <main>
        <GameBoard triangles={triangles} />
      </main>
    </div>
  );
};
