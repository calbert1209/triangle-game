import { MoveFn } from "boardgame.io";
import { TriangleId } from "./Triangle";
import { INVALID_MOVE } from "boardgame.io/core";
import { findFillableGroup } from "./fillableGroup";
import { TriangleGameState } from "./Game";

export const rollDice: MoveFn<TriangleGameState> = ({ G, events }) => {
  G.tries = Math.floor(Math.random() * 6) + 1;
  events.endStage();
};

export const pickCell: MoveFn<TriangleGameState> = (
  { G, ctx },
  id: TriangleId,
  rows: number,
  cols: number
) => {
  const idAlreadyStaged = G.stagedCells.includes(id);
  if (G.stagedCells.length >= G.tries && !idAlreadyStaged) {
    return INVALID_MOVE;
  }

  if (G.capturedCells[id] !== undefined) {
    return INVALID_MOVE;
  }

  const playerId = parseInt(ctx.currentPlayer, 10);
  if (idAlreadyStaged) {
    G.stagedCells = G.stagedCells.filter((cellId) => cellId !== id);
  } else {
    G.stagedCells.push(id);
  }
  const stagedAsCaptured = Object.fromEntries(
    G.stagedCells.map((id) => [id, playerId])
  );
  G.fillableGroup = [
    ...findFillableGroup(
      { ...G.capturedCells, ...stagedAsCaptured },
      playerId,
      rows,
      cols
    ),
  ];
};

export const revertPickCells: MoveFn<TriangleGameState> = ({ G }) => {
  G.stagedCells = [];
  G.fillableGroup = [];
};

export const captureCells: MoveFn<TriangleGameState> = ({ G, ctx, events }) => {
  if (G.stagedCells.length !== G.tries) {
    return INVALID_MOVE;
  }
  const playerId = parseInt(ctx.currentPlayer, 10);
  while (G.stagedCells.length > 0) {
    const stagedTriangleId = G.stagedCells.pop();
    G.capturedCells[stagedTriangleId] = playerId;
  }

  while (G.fillableGroup.length > 0) {
    const fillableTriangleId = G.fillableGroup.pop();
    G.capturedCells[fillableTriangleId] = playerId;
  }

  events.endTurn();
};
