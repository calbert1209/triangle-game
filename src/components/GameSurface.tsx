import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";
import { GameBoard } from "./GameBoard";
import { GameHeader } from "./Header";
import { GameContextProvider } from "./GameContext";

export const GameSurface = (props: BoardProps<TriangleGameState>) => {
  const { boardRows, boardCols } = props.G;
  return (
    <GameContextProvider {...props}>
      <div>
        <header>
          <GameHeader />
        </header>
        <main>
          {props.ctx.gameover === undefined ? (
            <GameBoard />
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
    </GameContextProvider>
  );
};
