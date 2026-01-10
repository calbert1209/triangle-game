import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";
import { createTriangle } from "../models/Triangle";
import { BOARD_ROWS, BOARD_COLS } from "../models/constants";
import { GameBoard } from "./GameBoard";
import { GameHeader } from "./Header";

const triangles = Array.from({ length: BOARD_ROWS }).flatMap((_, row) =>
  Array.from({ length: BOARD_COLS }).map((_, col) => {
    return createTriangle(row, col);
  })
);

export const GameSurface = (props: BoardProps<TriangleGameState>) => {
  return (
    <div>
      <header>
        <GameHeader {...props} />
      </header>
      <main>
        {props.ctx.gameover === undefined ? (
          <GameBoard {...props} triangles={triangles} />
        ) : (
          <div>
            <div>
              <h4>THE GAME IS OVER!</h4>
            </div>
            <div>
              <h2>
                🏆 {["🟥", "🟦", "🟩"][props.ctx.gameover?.winner ?? "-1"]} 👑
              </h2>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
