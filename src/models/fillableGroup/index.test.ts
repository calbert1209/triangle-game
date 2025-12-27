import { mapCellPotentials } from ".";
import { TriangleGameState } from "../Game";

const playerColor = "red";
const capturedCells: TriangleGameState["capturedCells"] = {
  "t-1-23": playerColor,
  "t-2-17": playerColor,
  "t-2-19": playerColor,
  "t-2-21": playerColor,
  "t-2-24": playerColor,
  "t-3-17": playerColor,
  "t-3-19": playerColor,
  "t-3-21": playerColor,
  "t-3-24": playerColor,
  "t-4-24": playerColor,
  "t-5-22": playerColor,
  "t-5-20": playerColor,
  "t-6-21": playerColor,
};

describe(`${mapCellPotentials.name}`, () => {
  const potentials = mapCellPotentials(capturedCells, playerColor);
  expect(potentials).toHaveProperty("t-2-18", 2);
  const potentialCounts = Object.values(potentials).reduce(
    (acc, potential) => {
      acc[potential] += 1;
      return acc;
    },
    { "0": 0, 1: 0, 2: 0, 3: 0, 4: 0 } as Record<number, number>
  );

  it("should have correct counts of potentials", () => {
    expect(potentialCounts).toEqual({
      0: 767,
      1: 24,
      2: 5,
      3: 1,
      4: 13,
    });
  });

  describe("should give cells specific potentials", () => {
    const cases = [
      { cellId: "t-5-21", expected: 3 },
      { cellId: "t-2-18", expected: 2 },
      { cellId: "t-2-20", expected: 2 },
      { cellId: "t-2-23", expected: 2 },
      { cellId: "t-3-18", expected: 2 },
      { cellId: "t-3-20", expected: 2 },
      { cellId: "t-2-22", expected: 1 },
      { cellId: "t-3-22", expected: 1 },
      { cellId: "t-3-23", expected: 1 },
      { cellId: "t-4-21", expected: 1 },
      { cellId: "t-4-22", expected: 1 },
      { cellId: "t-4-23", expected: 1 },
    ];
    it.each(cases)("$cellId -> $expected", ({ cellId, expected }) => {
      expect(potentials).toHaveProperty(cellId, expected);
    });
  });
});
