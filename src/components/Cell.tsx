import { Triangle, TriangleId } from "../models/Triangle";

export const Cell = ({
  triangle,
  fill,
  onClick,
}: {
  triangle: Triangle;
  fill: string;
  onClick: (id: TriangleId) => void;
}) => {
  const href = triangle.direction === "up" ? "#triangle" : "#triangle-down";
  return (
    <use
      key={triangle.id}
      href={href}
      x={triangle.col * 25 + 15}
      y={triangle.row * 42 - 100}
      fill={fill}
      stroke="#95A5A6"
      strokeWidth="0.5"
      data-selected="false"
      onClick={() => onClick(triangle.id)}
    />
  );
};
