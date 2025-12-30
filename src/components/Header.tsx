import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";

export const GameHeader = ({
  G,
  ctx,
  moves,
}: BoardProps<TriangleGameState>) => (
  <div class="row">
    <div id="redCount">999</div>
    <div id="blueCount">999</div>
    <div id="greenCount">999</div>
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
