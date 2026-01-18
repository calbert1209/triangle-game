import { Game } from "boardgame.io";
import { TriangleId } from "./Triangle";
import { rollDice, pickCell, revertPickCells, captureCells } from "./moves";
import { getFinalState } from "./finalState";

export interface TriangleGameState {
  capturedCells: Record<TriangleId, number>;
  tries: number;
  stagedCells: TriangleId[];
  fillableGroup: TriangleId[];
  boardRows: number;
  boardCols: number;
}

export const createTriangleGame = (
  boardRows: number,
  boardCols: number,
): Game<TriangleGameState> => ({
  setup: (): TriangleGameState => {
    return {
      capturedCells: {},
      tries: 0,
      stagedCells: [],
      fillableGroup: [],
      boardRows,
      boardCols,
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

  endIf: ({ G, ctx }) => {
    const { capturedCells, stagedCells, fillableGroup } = G;
    const totalCaptured = Object.keys(capturedCells).length;
    const totalTriangles = (G.boardRows - 2) * (G.boardCols - 2);

    if (
      totalTriangles >
      totalCaptured + stagedCells.length + fillableGroup.length
    )
      return;
    const { currentPlayer, numPlayers } = ctx;
    const finalState = getFinalState({
      capturedCells,
      stagedCells: [...stagedCells, ...fillableGroup],
      currentPlayer,
      numPlayers,
    });

    if (finalState.winner === -1) {
      return { draw: true };
    }

    return { winner: finalState.winner.toString() };
  },

  onEnd: ({ G, ctx }) => {
    const playerId = parseInt(ctx.currentPlayer, 10);
    while (G.stagedCells.length > 0) {
      const stagedTriangleId = G.stagedCells.pop();
      G.capturedCells[stagedTriangleId] = playerId;
    }

    while (G.fillableGroup.length > 0) {
      const fillableTriangleId = G.fillableGroup.pop();
      G.capturedCells[fillableTriangleId] = playerId;
    }
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
});
