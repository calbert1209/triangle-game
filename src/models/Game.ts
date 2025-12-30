import { Game, MoveFn } from "boardgame.io";
import { Client } from "boardgame.io/react";
import { TriangleId } from "./Triangle";
import { GameSurface } from "../components/GameSurface";
import { INVALID_MOVE } from "boardgame.io/core";

export interface TriangleGameState {
  capturedCells: Record<TriangleId, number>;
  tries: number;
  stagedCells: TriangleId[];
}

const rollDice: MoveFn<TriangleGameState> = ({ G, events }) => {
  G.tries = Math.floor(Math.random() * 6) + 1;
  events.endStage();
};

const pickCell: MoveFn<TriangleGameState> = ({ G }, id: TriangleId) => {
  if (G.stagedCells.length >= G.tries) {
    return INVALID_MOVE;
  }

  if (G.capturedCells[id] !== undefined) {
    return INVALID_MOVE;
  }

  G.stagedCells.push(id);
};

const revertPickCells: MoveFn<TriangleGameState> = ({ G }) => {
  G.stagedCells = [];
};

const captureCells: MoveFn<TriangleGameState> = ({ G, ctx, events }) => {
  const playerId = parseInt(ctx.currentPlayer, 10);
  while (G.stagedCells.length > 0) {
    const stagedTriangleId = G.stagedCells.pop()!;
    G.capturedCells[stagedTriangleId] = playerId;
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
    };
  },

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

export const TriangleGameApp = Client({
  game: TriangleGame,
  board: GameSurface,
});
