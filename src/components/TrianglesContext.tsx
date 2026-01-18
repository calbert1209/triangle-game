import { createTriangle, Triangle } from "../models/Triangle";
import { ComponentChildren, createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";

interface TrianglesContext {
  triangles: Triangle[];
}

const initialTrianglesContext = {
  triangles: [],
};

const TrianglesContext = createContext<TrianglesContext>(
  initialTrianglesContext,
);

interface TrianglesContextProviderProps {
  children: ComponentChildren;
  rows: number;
  cols: number;
}

export const TriangleContextProvider = ({
  rows,
  cols,
  children,
}: TrianglesContextProviderProps) => {
  const triangles = useMemo(
    () =>
      Array.from({ length: rows }).flatMap((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          return createTriangle(row, col, rows, cols);
        }),
      ),
    [],
  );

  return (
    <TrianglesContext.Provider value={{ triangles }}>
      {children}
    </TrianglesContext.Provider>
  );
};

export const useTrianglesContext = () => {
  const context = useContext(TrianglesContext);
  if (context === undefined) {
    throw new Error(
      "useTrianglesContext must be used within a TriangleContextProvider",
    );
  }
  return context;
};
