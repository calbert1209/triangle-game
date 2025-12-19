import { Triangle } from "../models/Triangle";
import { Cell } from "./Cell";
import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";

interface Props extends BoardProps<TriangleGameState> {
  triangles: Array<Triangle>;
}

export const GameBoard = ({ G, ctx, triangles, moves }: Props) => (
  <svg id="svgBox" viewBox="0 0 1400 800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <path id="triangle" d="M31 79 L79 79 L55 37.6 Z" />
      <path id="triangle-down" d="M31 37.6 L79 37.6 L55 79 Z" />
    </defs>
    <rect width="1300" height="770" fill="gray" />
    {triangles.map((triangle) => (
      <Cell
        triangle={triangle}
        fill={G.capturedCells[triangle.id] || "white"}
        onClick={(id) => {
          moves.captureCell(id);
        }}
      />
    ))}
  </svg>
);
