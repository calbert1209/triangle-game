import { TriangleGameState } from "../Game";
import { createTriangleFromId, TriangleId } from "../Triangle";

const iterateThroughBoardCells = (
  cb: (r: number, c: number) => void,
  rows: number,
  cols: number,
) => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cb(row, col);
    }
  }
};

export const findEdgeCells = (rows: number, cols: number): Set<TriangleId> => {
  const edgeCells = new Set<TriangleId>();
  iterateThroughBoardCells(
    (r, c) => {
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        const cellId: TriangleId = `t-${r}-${c}`;
        edgeCells.add(cellId);
      }
    },
    rows,
    cols,
  );
  return edgeCells;
};

export const findOutsideCells = (
  capturedCells: TriangleGameState["capturedCells"],
  playerId: number,
  rows: number,
  cols: number,
): Set<TriangleId> => {
  const outsideCells = new Set<TriangleId>();
  const visitedCells = new Set<TriangleId>();
  const edgeCells = findEdgeCells(rows, cols);
  const otherPlayersCells = Object.entries(capturedCells)
    .filter(([_, owner]) => owner !== playerId)
    .map(([cellId, _]) => cellId as TriangleId);
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

export const findFillableGroup = (
  capturedCells: TriangleGameState["capturedCells"],
  playerId: number,
  rows: number,
  cols: number,
): Set<TriangleId> => {
  const outsideCells = findOutsideCells(capturedCells, playerId, rows, cols);
  const enclosedCells = new Set<TriangleId>();
  iterateThroughBoardCells(
    (r, c) => {
      const cellId: TriangleId = `t-${r}-${c}`;
      if (!outsideCells.has(cellId) && capturedCells[cellId] === undefined) {
        enclosedCells.add(cellId);
      }
    },
    rows,
    cols,
  );
  return enclosedCells;
};
