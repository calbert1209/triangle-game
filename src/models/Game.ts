import { Game, MoveFn } from "boardgame.io";
import { Client } from "boardgame.io/react";
import { TriangleId } from "./Triangle";
import { GameSurface } from "../components/GameSurface";
import { INVALID_MOVE } from "boardgame.io/core";

export interface TriangleGameState {
  capturedCells: Record<TriangleId, string>;
  tries: number;
  stagedCells: TriangleId[];
}

const captureCell: MoveFn<TriangleGameState> = ({ G, ctx }, triangleId: TriangleId) => {
  if (G.capturedCells[triangleId]) {
    return INVALID_MOVE;
  }

  const playerColor = ctx.currentPlayer === "0" ? "red" : "blue";
  G.capturedCells[triangleId] = playerColor;
}


const rollDice: MoveFn<TriangleGameState> = ({ G, ctx }) => {
  // Implement dice rolling logic here
}

export const TriangleGame: Game<TriangleGameState> = {
  setup: (): TriangleGameState => ({ capturedCells: {}, tries: 0, stagedCells: [] }),

  moves: {
    captureCell,
  },

  turn: {
    minMoves: 1,
    maxMoves: 1,
    stages: {
      capture: {
        moves: {
          captureCell,
        },
      },
      roll: {
        moves: {
          rollDice,
        },
      }
    }
  }
}

export const TriangleGameApp = Client({ game: TriangleGame, board: GameSurface });