export type TriangleId = `t-${number}-${number}`;

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
  direction: "up" | "down"
): Triangle => {
  const id: TriangleId = `t-${row}-${col}`;

  const neighborIds: TriangleId[] = direction === "down"
    ? [
      `t-${row - 1}-${col}`,
      `t-${row}-${col - 1}`,
      `t-${row}-${col + 1}`,
    ]
    : [
      `t-${row + 1}-${col}`,
      `t-${row}-${col - 1}`,
      `t-${row}-${col + 1}`,
    ];

  return { row, col, direction, id, neighborIds };
}

// export class Triangle {
//   constructor(
//     public row: number,
//     public col: number,
//     public direction: "up" | "down"
//   ) { }

//   get id(): TriangleId {
//     return `t-${this.row}-${this.col}`;
//   }

//   neighborIds(): TriangleId[] {
//     if (this.direction === "down") {
//       return [
//         `t-${this.row - 1}-${this.col}`,
//         `t-${this.row}-${this.col - 1}`,
//         `t-${this.row}-${this.col + 1}`,
//       ];
//     } else {
//       return [
//         `t-${this.row + 1}-${this.col}`,
//         `t-${this.row}-${this.col - 1}`,
//         `t-${this.row}-${this.col + 1}`,
//       ];
//     }
//   }
// }