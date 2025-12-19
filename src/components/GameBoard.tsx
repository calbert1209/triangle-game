import { Triangle } from "../models/Triangle";
import { Cell } from "./Cell";
import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";
import { getColorHex } from "../models/colors";

interface Props extends BoardProps<TriangleGameState> {
  triangles: Array<Triangle>;
}

export const GameBoard = ({ G, triangles, moves }: Props) => (
  <svg
    id="svgBox"
    viewBox="0 0 1400 680"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <path id="triangle" d="M31 79 L79 79 L55 37.6 Z" />
      <path id="triangle-down" d="M31 37.6 L79 37.6 L55 79 Z" />
      <linearGradient id="boardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ECF0F1;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#D5DBDB;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1400" height="680" fill="url(#boardGradient)" />
    {triangles.map((triangle) => (
      <Cell
        triangle={triangle}
        fill={getColorHex(G.capturedCells[triangle.id] || "white")}
        onClick={(id) => {
          moves.captureCell(id);
        }}
      />
    ))}
  </svg>
);
