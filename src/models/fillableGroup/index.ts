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

const iterateThroughBoardCells = (cb: (r: number, c: number) => void) => {
  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      cb(row, col);
    }
  }
};

export const mapCellPotentials = (
  capturedCells: TriangleGameState["capturedCells"],
  playerColor: "red" | "blue"
) => {
  const potentials: Record<TriangleId, number> = {};
  iterateThroughBoardCells((r, c) => {
    const cellId: TriangleId = `t-${r}-${c}`;
    potentials[cellId] = getCellPotential([r, c], capturedCells, playerColor);
  });

  return potentials;
};

export const checkAllAdjacentCells = (
  cellId: TriangleId,
  potentials: Record<TriangleId, number>
): {
  neighbors: TriangleId[];
  canFill: boolean;
} => {
  const checkedNeighbors = new Set<TriangleId>();
  const queue: TriangleId[] = [cellId];
  let openEdgeFound = false;
  while (!openEdgeFound && queue.length > 0) {
    const currentCellId = queue.shift() as TriangleId;
    const triangle = createTriangleFromId(currentCellId);
    for (const neighborId of triangle.neighborIds) {
      if (checkedNeighbors.has(neighborId)) {
        continue;
      }
      if (potentials[neighborId] === 4) {
        continue;
      }
      if (potentials[neighborId] === 0) {
        openEdgeFound = true;
        break;
      }
      checkedNeighbors.add(neighborId);
      queue.push(neighborId);
    }
  }

  return {
    neighbors: Array.from(checkedNeighbors),
    canFill: !openEdgeFound,
  };
};

export const findFillableGroup = (
  capturedCells: TriangleGameState["capturedCells"],
  playerColor: "red" | "blue"
): TriangleId[] => {
  const potentials = mapCellPotentials(capturedCells, playerColor);
  const output = new Set<TriangleId>();
  const notFillable = new Set<TriangleId>();
  for (const cellId of Object.keys(potentials) as TriangleId[]) {
    if (output.has(cellId) || notFillable.has(cellId)) {
      continue;
    }
    if (potentials[cellId] === 4 || potentials[cellId] === 0) {
      continue;
    }
    if (potentials[cellId] === 3) {
      output.add(cellId);
    }

    const { neighbors, canFill } = checkAllAdjacentCells(cellId, potentials);
    const targetSet = canFill ? output : notFillable;
    neighbors.forEach((cellId) => {
      targetSet.add(cellId);
    });
  }

  return Array.from(output);
};
