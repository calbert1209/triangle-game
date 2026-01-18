import { createTriangleGame } from "../models/Game";
import { useMemo } from "preact/hooks";
import { Client } from "boardgame.io/react";
import { GameSurface } from "./GameSurface";
import { DIMENSIONS, MOBILE_DIMENSIONS } from "../models/constants";

const createClient = (numPlayers: number, rows: number, cols: number) => {
  return Client({
    numPlayers,
    game: createTriangleGame(rows, cols),
    board: GameSurface,
  });
};

export const TriangleGameApp = () => {
  const Client = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const numPlayers = params.get("players") === "3" ? 3 : 2;
    const isMobile = params.get("mobile") === "true";
    const [rows, cols] = isMobile ? MOBILE_DIMENSIONS : DIMENSIONS;
    return createClient(numPlayers, rows, cols);
  }, [window.location.search]);

  return <Client />;
};
