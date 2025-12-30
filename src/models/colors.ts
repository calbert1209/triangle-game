import { Ctx } from "boardgame.io";
import { TriangleGameState } from "./Game";
import { TriangleId } from "./Triangle";

export const COLOR_MAP: Record<string, string> = {
  red: "#FF3B3B",
  pickedRed: "#FF6262",
  blue: "#3B8BFF",
  pickedBlue: "#62A2FF",
  green: "#00D66F",
  pickedGreen: "#33DE8C",
  white: "white",
};

export const getColorHex = (colorName: string): string => {
  return COLOR_MAP[colorName] || colorName;
};

export const getCellColorHex = (
  G: TriangleGameState,
  ctx: Ctx,
  id: TriangleId
) => {
  if (G.capturedCells[id]) {
    return getColorHex(G.capturedCells[id]);
  }

  const color = ["pickedRed", "pickedBlue", "pickedGreen"][
    parseInt(ctx.currentPlayer, 10)
  ];
  if (G.stagedCells.includes(id)) {
    return getColorHex(color);
  }

  return getColorHex("white");
};
