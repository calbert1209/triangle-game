import { Triangle, TriangleId } from "../models/Triangle";
import { Cell } from "./Cell";
import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";
import { COLOR_MAP, getCellColorHex } from "../models/colors";
import { findEdgeCells } from "../models/fillableGroup";
import { useCallback } from "preact/hooks";

interface Props extends BoardProps<TriangleGameState> {
  triangles: Array<Triangle>;
}

const edgeCells = findEdgeCells();

export const GameBoard = ({ G, ctx, triangles, moves }: Props) => {
  const onClick = useCallback((id: TriangleId) => {
    if (edgeCells.has(id)) return;

    moves.pickCell(id);
  }, []);

  const getFill = useCallback(
    (id: TriangleId) => {
      if (edgeCells.has(id)) {
        return COLOR_MAP.grey;
      }
      return getCellColorHex(G, ctx, id);
    },
    [G, ctx]
  );
  return (
    <svg
      id="svgBox"
      viewBox="0 0 1200 550"
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
      <rect width="1200" height="550" fill="url(#boardGradient)" />
      {triangles.map((triangle) => (
        <Cell
          triangle={triangle}
          fill={getFill(triangle.id)}
          onClick={onClick}
        />
      ))}
    </svg>
  );
};
