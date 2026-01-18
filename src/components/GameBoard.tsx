import { TriangleId } from "../models/Triangle";
import { Cell } from "./Cell";
import { COLOR_MAP, getCellColorHex } from "../models/colors";
import { findEdgeCells } from "../models/fillableGroup";
import { useCallback, useMemo } from "preact/hooks";
import { useGameContext } from "./GameContext";
import { useTrianglesContext } from "./TrianglesContext";

export const GameBoard = () => {
  const { G, ctx, moves } = useGameContext();
  const { triangles, boardRows, boardCols } = useTrianglesContext();

  const edgeCells = useMemo(() => {
    return findEdgeCells(boardRows, boardCols);
    // TODO: deal with dynamic board size
  }, []);

  const onClick = useCallback((id: TriangleId) => {
    if (edgeCells.has(id)) return;

    moves.pickCell(id, boardRows, boardCols);
    // TODO: deal with changes to edgeCells.
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

  const newViewBox = useMemo(() => {
    const maxRow = boardRows - 2; //Math.max(...triangles.map((t) => t.row));
    const maxCol = boardCols - 2; //Math.max(...triangles.map((t) => t.col));
    const minX = 15;
    const minY = -60;
    const maxX = maxCol * 25 + 15 + 79; // col position + offset + triangle width
    const maxY = maxRow * 42 - 60 + 79; // row position + offset + triangle height
    const width = maxX - minX;
    const height = maxY - minY;
    return `${minX} ${minY} ${width} ${height}`;
    // TODO: deal with dynamic board size
  }, []);

  return (
    <svg
      id="svgBox"
      viewBox={newViewBox}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <path id="triangle" d="M31 79 L79 79 L55 37.6 Z" />
        <path id="triangle-down" d="M31 37.6 L79 37.6 L55 79 Z" />
      </defs>
      {triangles
        .filter((triangle) => !edgeCells.has(triangle.id))
        .map((triangle) => (
          <Cell
            triangle={triangle}
            fill={getFill(triangle.id)}
            onClick={onClick}
          />
        ))}
    </svg>
  );
};
