import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";
import { useMemo } from "preact/hooks";

export const GameHeader = ({
  G,
  ctx,
  moves,
}: BoardProps<TriangleGameState>) => {
  const counts = useMemo(() => {
    const [red, blue, green] = Object.values(G.capturedCells).reduce(
      (acc, owner) => {
        acc[owner] += 1;
        return acc;
      },
      [0, 0, 0]
    );
    return { red, blue, green };
  }, [G.capturedCells]);
  return (
    <div class="row">
      <div id="redCount">{counts.red}</div>
      <div id="blueCount">{counts.blue}</div>
      <div id="greenCount">{counts.green}</div>
      {ctx.activePlayers[ctx.currentPlayer] === "roll" ? (
        <div id="status">
          <button id="rollBtn" onClick={moves.rollDice}>
            Roll Dice
          </button>
        </div>
      ) : null}
      {ctx.activePlayers[ctx.currentPlayer] === "pick" ? (
        <div id="status">
          <div>Tries left: {G.tries - G.stagedCells.length}</div>
          <button onClick={moves.captureCells}>capture</button>
          <button onClick={moves.revertPickCells}>undo</button>
        </div>
      ) : null}
    </div>
  );
};
