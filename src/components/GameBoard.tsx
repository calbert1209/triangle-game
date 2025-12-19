import { Cell } from "./Cell";

interface Props {
  triangles: Array<any>;
}

export const GameBoard = ({ triangles }: Props) => (
  <svg id="svgBox" viewBox="0 0 1400 800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <path id="triangle" d="M31 79 L79 79 L55 37.6 Z" />
      <path id="triangle-down" d="M31 37.6 L79 37.6 L55 79 Z" />
    </defs>
    <rect width="1300" height="770" fill="gray" />
    {triangles.map((triangle) => (
      <Cell triangle={triangle} />
    ))}
  </svg>
);
