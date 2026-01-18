import { BoardProps } from "boardgame.io/dist/types/packages/react";
import { TriangleGameState } from "../models/Game";
import { ComponentChildren, createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";
import { createTriangle, Triangle } from "../models/Triangle";

interface GameContext extends BoardProps<TriangleGameState> {
  triangles: Triangle[];
}

const GameContext = createContext<GameContext | null>(null);

export const GameContextProvider = ({
  children,
  ...props
}: BoardProps<TriangleGameState> & { children: ComponentChildren }) => {
  const triangles = useMemo(
    () =>
      Array.from({ length: props.G.boardRows }).flatMap((_, row) =>
        Array.from({ length: props.G.boardCols }).map((_, col) => {
          return createTriangle(row, col, props.G.boardRows, props.G.boardCols);
        }),
      ),
    [],
  );
  return (
    <GameContext.Provider value={{ ...props, triangles }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
