import { BOARD_COLS, BOARD_ROWS } from "../../components/GameSurface";
import { TriangleGameState } from "../Game";
import { createTriangleFromId, TriangleId } from "../Triangle";

const getCellPotential = (
  [c, r]: [number, number],
  capturedCells: TriangleGameState["capturedCells"],
  playerColor: "red" | "blue"
): number => {
  const cellId: TriangleId = `t-${c}-${r}`;
  if (capturedCells[cellId]) {
    return capturedCells[cellId] === playerColor ? 4 : 0;
  }

  const triangle = createTriangleFromId(cellId);
  let potential = 0;

  for (const neighborId of triangle.neighborIds) {
    if (capturedCells[neighborId] === playerColor) {
      potential += 1;
    }
  }

  return potential;
};

export const mapCellPotentials = (
  capturedCells: TriangleGameState["capturedCells"],
  playerColor: "red" | "blue"
) => {
  const potentials: Record<TriangleId, number> = {};
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      const cellId: TriangleId = `t-${row}-${col}`;
      potentials[cellId] = getCellPotential(
        [row, col],
        capturedCells,
        playerColor
      );
    }
  }
  return potentials;
};
