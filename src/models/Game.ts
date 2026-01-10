import { Game, MoveFn } from "boardgame.io";
import { TriangleId } from "./Triangle";
import { INVALID_MOVE } from "boardgame.io/core";
import { findFillableGroup } from "./fillableGroup";

export interface TriangleGameState {
  capturedCells: Record<TriangleId, number>;
  tries: number;
  stagedCells: TriangleId[];
  fillableGroup: TriangleId[];
}

const rollDice: MoveFn<TriangleGameState> = ({ G, events }) => {
  G.tries = Math.floor(Math.random() * 6) + 1;
  events.endStage();
};

const pickCell: MoveFn<TriangleGameState> = ({ G, ctx }, id: TriangleId) => {
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
    ...findFillableGroup({ ...G.capturedCells, ...stagedAsCaptured }, playerId),
  ];
};

const revertPickCells: MoveFn<TriangleGameState> = ({ G }) => {
  G.stagedCells = [];
  G.fillableGroup = [];
};

const captureCells: MoveFn<TriangleGameState> = ({ G, ctx, events }) => {
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

export const TriangleGame: Game<TriangleGameState> = {
  setup: ({ events }): TriangleGameState => {
    // events.setActivePlayers({ currentPlayer: "roll" });
    return {
      capturedCells: {},
      tries: 0,
      stagedCells: [],
      fillableGroup: [],
    };
  },

  minPlayers: 2,
  maxPlayers: 3,

  moves: {
    rollDice,
    pickCell,
    revertPickCells,
    captureCells,
  },

  turn: {
    activePlayers: { currentPlayer: "roll" },
    stages: {
      roll: {
        moves: {
          rollDice,
        },
        next: "pick",
      },
      pick: {
        moves: { pickCell, captureCells, revertPickCells },
      },
    },
  },
};
