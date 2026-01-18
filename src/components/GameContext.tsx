import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";
import { ComponentChildren, createContext } from "preact";
import { useContext } from "preact/hooks";

const GameContext = createContext<BoardProps<TriangleGameState> | null>(null);

export const GameContextProvider = ({
  children,
  ...props
}: BoardProps<TriangleGameState> & { children: ComponentChildren }) => {
  return <GameContext.Provider value={props}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
