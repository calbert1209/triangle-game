import { useMemo } from "preact/hooks";
import { DiceIcon, UndoIcon, CheckMarkIcon } from "./Icons";
import { useGameContext } from "./GameContext";

export const GameHeader = () => {
  const { G, ctx, moves } = useGameContext();

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
        <div className="counter redCount upward">{counts.red}</div>
        <div className="counter blueCount downward">{counts.blue}</div>
        <div
          className="counter greenCount upward"
          data-hidden={ctx.numPlayers === 2}
        >
          {counts.green}
        </div>
      </div>
      {ctx.activePlayers[ctx.currentPlayer] === "roll" ? (
        <div id="actionBtns">
          <button id="rollBtn" className="downward" onClick={moves.rollDice}>
            <DiceIcon />
          </button>
        </div>
      ) : null}
      {ctx.activePlayers[ctx.currentPlayer] === "pick" ? (
        <div id="actionBtns">
          <button
            id="undoBtn"
            className="downward"
            onClick={moves.revertPickCells}
          >
            <UndoIcon />
          </button>
          <CaptureButton onClick={moves.captureCells} />
        </div>
      ) : null}
    </div>
  );
};

interface CaptureButtonProps {
  onClick: () => void;
}

const CaptureButton = ({ onClick }: CaptureButtonProps) => {
  const { G, ctx } = useGameContext();
  const color = useMemo(() => {
    const currentPlayerIndex = parseInt(ctx.currentPlayer, 10);
    return ["red", "blue", "green"][currentPlayerIndex];
  }, [ctx.currentPlayer]);

  const enabled = G.stagedCells.length === G.tries;
  return (
    <button
      id="captureBtn"
      class={`${color} upward`}
      onClick={onClick}
      disabled={!enabled}
    >
      {enabled ? <CheckMarkIcon /> : G.tries - G.stagedCells.length}
    </button>
  );
};
