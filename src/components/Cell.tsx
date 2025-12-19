import { Triangle } from "../models/Triangle";

export const Cell = ({ triangle }: { triangle: Triangle }) => {
  const href = triangle.direction === "up" ? "#triangle" : "#triangle-down";
  return (
    <use
      key={triangle.id}
      href={href}
      x={triangle.col * 25 - 25}
      y={triangle.row * 42 - 30}
      data-selected="false"
      onClick={() =>
        console.log(
          `Clicked on ${triangle.id}, neighbors: ${triangle.neighborIds.join(
            ", "
          )}`
        )
      }
    />
  );
};
