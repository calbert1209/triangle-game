import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";
import { GameBoard } from "./GameBoard";
import { GameHeader } from "./Header";
import { GameContextProvider } from "./GameContext";
import { TriangleContextProvider } from "./TrianglesContext";

export const GameSurface = (props: BoardProps<TriangleGameState>) => {
  const { boardRows, boardCols } = props.G;
  return (
    <GameContextProvider {...props}>
      <TriangleContextProvider rows={boardRows} cols={boardCols}>
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
                    🏆 {["🟥", "🟦", "🟩"][props.ctx.gameover?.winner ?? "-1"]}{" "}
                    👑
                  </h2>
                </div>
              </div>
            )}
          </main>
        </div>
      </TriangleContextProvider>
    </GameContextProvider>
  );
};
