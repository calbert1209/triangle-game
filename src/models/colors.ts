import { Ctx } from "boardgame.io";
import { TriangleGameState } from "./Game";
import { TriangleId } from "./Triangle";

export const COLOR_MAP: Record<string, string> = {
  red: "#ff5252",
  pickedRed: "#ff8a80",
  blue: "#3d5afe",
  pickedBlue: "#8c9eff",
  green: "#00e676",
  pickedGreen: "#69f0ae",
  white: "white",
  grey: "#f5f5f5",
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
