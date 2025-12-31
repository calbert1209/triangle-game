import { BOARD_COLS, BOARD_ROWS } from "../constants";
import { TriangleGameState } from "../Game";
import { createTriangleFromId, TriangleId } from "../Triangle";

const getCellPotential = (
  [c, r]: [number, number],
  capturedCells: TriangleGameState["capturedCells"],
  playerId: number
): number => {
  const cellId: TriangleId = `t-${c}-${r}`;
  const owner = capturedCells[cellId];
  if (owner !== undefined) {
    return owner === playerId ? 4 : 0;
  }

  const triangle = createTriangleFromId(cellId);
  let potential = 0;

  for (const neighborId of triangle.neighborIds) {
    if (capturedCells[neighborId] === playerId) {
      potential += 1;
    }
  }

  return potential;
};

const iterateThroughBoardCells = (
  cb: (r: number, c: number) => void,
  rows = BOARD_ROWS,
  cols = BOARD_COLS
) => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cb(row, col);
    }
  }
};

export const mapCellPotentials = (
  capturedCells: TriangleGameState["capturedCells"],
  playerId: number
) => {
  const potentials: Record<TriangleId, number> = {};
  iterateThroughBoardCells((r, c) => {
    const cellId: TriangleId = `t-${r}-${c}`;
    potentials[cellId] = getCellPotential([r, c], capturedCells, playerId);
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
  playerId: number
): TriangleId[] => {
  const potentials = mapCellPotentials(capturedCells, playerId);
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

export const findEdgeCells = (
  rows = BOARD_ROWS,
  cols = BOARD_COLS
): Set<TriangleId> => {
  const edgeCells = new Set<TriangleId>();
  iterateThroughBoardCells(
    (r, c) => {
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        const cellId: TriangleId = `t-${r}-${c}`;
        edgeCells.add(cellId);
      }
    },
    rows,
    cols
  );
  return edgeCells;
};

export const findOutsideCells = (
  capturedCells: TriangleGameState["capturedCells"],
  playerId: number,
  rows = BOARD_ROWS,
  cols = BOARD_COLS
): Set<TriangleId> => {
  const outsideCells = new Set<TriangleId>();
  const visitedCells = new Set<TriangleId>();
  const edgeCells = findEdgeCells(rows, cols);
  const otherPlayersCells = Object.entries(capturedCells)
    .filter(([_, owner]) => owner !== playerId)
    .map(([cellId, _]) => cellId as TriangleId);
  otherPlayersCells.forEach((cellId) => visitedCells.add(cellId));
  const queue = Array.from<TriangleId>([...edgeCells, ...otherPlayersCells]);

  while (queue.length > 0) {
    const currentCellId = queue.shift();
    if (visitedCells.has(currentCellId)) {
      continue;
    }
    visitedCells.add(currentCellId);
    const owner = capturedCells[currentCellId];
    if (owner === playerId) {
      continue;
    }
    outsideCells.add(currentCellId);

    const triangle = createTriangleFromId(currentCellId, rows, cols);
    for (const neighborId of triangle.neighborIds) {
      if (visitedCells.has(neighborId)) {
        continue;
      }
      const owner = capturedCells[neighborId];
      if (owner !== playerId) {
        outsideCells.add(neighborId);
        queue.push(neighborId);
      }
    }
  }
  return outsideCells;
};
