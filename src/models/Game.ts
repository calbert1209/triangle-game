import { Game, MoveFn } from "boardgame.io";
import { Client } from "boardgame.io/react";
import { TriangleId } from "./Triangle";
import { GameSurface } from "../components/GameSurface";

export interface TriangleGameState {
  capturedCells: Record<TriangleId, string>;
}

const captureCell: MoveFn<TriangleGameState> = ({ G, ctx }, triangleId: TriangleId) => {
  const playerColor = ctx.currentPlayer === "0" ? "red" : "blue";
  G.capturedCells[triangleId] = playerColor;
}

export const TriangleGame: Game<TriangleGameState> = {
  setup: (): TriangleGameState => ({ capturedCells: {} }),

  moves: {
    captureCell,
  },

  turn: {
    minMoves: 1,
    maxMoves: 1,
  }
}

export const TriangleGameApp = Client({ game: TriangleGame, board: GameSurface });