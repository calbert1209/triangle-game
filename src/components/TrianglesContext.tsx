import { createTriangle, Triangle } from "../models/Triangle";
import { BOARD_ROWS, BOARD_COLS } from "../models/constants";
import { ComponentChildren, createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";

interface TrianglesContext {
  triangles: Triangle[];
  boardRows: number;
  boardCols: number;
}

const initialTrianglesContext = {
  triangles: [],
  boardRows: 0,
  boardCols: 0,
};

const TrianglesContext = createContext<TrianglesContext>(
  initialTrianglesContext
);

interface TrianglesContextProviderProps {
  children: ComponentChildren;
}

export const TriangleContextProvider = ({
  children,
}: TrianglesContextProviderProps) => {
  const triangles = useMemo(
    () =>
      Array.from({ length: BOARD_ROWS }).flatMap((_, row) =>
        Array.from({ length: BOARD_COLS }).map((_, col) => {
          return createTriangle(row, col, BOARD_ROWS, BOARD_COLS);
        })
      ),
    []
  );

  return (
    <TrianglesContext.Provider
      value={{ triangles, boardRows: BOARD_ROWS, boardCols: BOARD_COLS }}
    >
      {children}
    </TrianglesContext.Provider>
  );
};

export const useTrianglesContext = () => {
  const context = useContext(TrianglesContext);
  if (context === undefined) {
    throw new Error(
      "useTrianglesContext must be used within a TriangleContextProvider"
    );
  }
  return context;
};
