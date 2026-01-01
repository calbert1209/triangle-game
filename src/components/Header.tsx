import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";
import { useMemo } from "preact/hooks";
import { DiceIcon, UndoIcon, CheckMarkIcon } from "./Icons";

export const GameHeader = ({
  G,
  ctx,
  moves,
  ...rest
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
      <div className="counts">
        <div id="redCount">{counts.red}</div>
        <div id="blueCount">{counts.blue}</div>
        <div id="greenCount">{counts.green}</div>
      </div>
      {ctx.activePlayers[ctx.currentPlayer] === "roll" ? (
        <div id="actionBtns">
          <button id="rollBtn" onClick={moves.rollDice}>
            <DiceIcon />
          </button>
        </div>
      ) : null}
      {ctx.activePlayers[ctx.currentPlayer] === "pick" ? (
        <div id="actionBtns">
          <button id="undoBtn" onClick={moves.revertPickCells}>
            <UndoIcon />
          </button>
          <CaptureButton
            onClick={moves.captureCells}
            {...{ G, ctx, moves, ...rest }}
          />
        </div>
      ) : null}
    </div>
  );
};

interface CaptureButtonProps extends BoardProps<TriangleGameState> {
  onClick: () => void;
}

const CaptureButton = ({ G, ctx, onClick }: CaptureButtonProps) => {
  const className = useMemo(() => {
    const currentPlayerIndex = parseInt(ctx.currentPlayer, 10);
    return ["red", "blue", "green"][currentPlayerIndex];
  }, [ctx.currentPlayer]);
  return (
    <button id="captureBtn" class={className} onClick={onClick}>
      {G.stagedCells.length === G.tries ? (
        <CheckMarkIcon />
      ) : (
        G.tries - G.stagedCells.length
      )}
    </button>
  );
};
