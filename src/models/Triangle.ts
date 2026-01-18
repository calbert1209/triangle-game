export type TriangleId = `t-${number}-${number}`;

export const getRowColFromId = (id: TriangleId): [number, number] => {
  const [, rString, cString] = id.split("-");
  return [rString, cString].map((n) => parseInt(n, 10)) as [number, number];
};

export interface Triangle {
  row: number;
  col: number;
  direction: "up" | "down";
  id: TriangleId;
  neighborIds: TriangleId[];
}

export const createTriangle = (
  row: number,
  col: number,
  rows: number,
  cols: number
): Triangle => {
  const direction = (col + row) % 2 === 0 ? "up" : "down";
  const id: TriangleId = `t-${row}-${col}`;

  const neighborIds: TriangleId[] = (
    direction === "down"
      ? [
          [row - 1, col],
          [row, col - 1],
          [row, col + 1],
        ]
      : [
          [row + 1, col],
          [row, col - 1],
          [row, col + 1],
        ]
  )
    .filter(([r, c]) => r >= 0 && r < rows && c >= 0 && c < cols)
    .map(([r, c]) => `t-${r}-${c}` satisfies TriangleId);

  return { row, col, direction, id, neighborIds };
};

export const createTriangleFromId = (
  id: TriangleId,
  rows: number,
  cols: number
): Triangle => {
  const [row, col] = getRowColFromId(id);
  return createTriangle(row, col, rows, cols);
};
