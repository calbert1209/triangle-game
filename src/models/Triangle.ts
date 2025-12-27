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

export const createTriangle = (row: number, col: number): Triangle => {
  const direction = (col + row) % 2 === 0 ? "up" : "down";
  const id: TriangleId = `t-${row}-${col}`;

  const neighborIds: TriangleId[] =
    direction === "down"
      ? [`t-${row - 1}-${col}`, `t-${row}-${col - 1}`, `t-${row}-${col + 1}`]
      : [`t-${row + 1}-${col}`, `t-${row}-${col - 1}`, `t-${row}-${col + 1}`];

  return { row, col, direction, id, neighborIds };
};

export const createTriangleFromId = (id: TriangleId): Triangle => {
  const [row, col] = getRowColFromId(id);
  return createTriangle(row, col);
};
