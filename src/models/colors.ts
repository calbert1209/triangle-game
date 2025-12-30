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

export const getCellColorHex = (
  G: TriangleGameState,
  ctx: Ctx,
  id: TriangleId
) => {
  const playerColors = ["red", "blue", "green"] as const;
  const owner = G.capturedCells[id];
  if (owner !== undefined) {
    return COLOR_MAP[playerColors[owner]];
  }

  const pickedColors = ["pickedRed", "pickedBlue", "pickedGreen"] as const;
  const currentPlayerIndex = parseInt(ctx.currentPlayer, 10);
  const stagedColor = pickedColors[currentPlayerIndex];
  if (G.stagedCells.includes(id)) {
    return COLOR_MAP[stagedColor];
  }

  return COLOR_MAP["white"];
};
