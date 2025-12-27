import { mapCellPotentials } from ".";
import { TriangleGameState } from "../Game";

const capturedCells: TriangleGameState["capturedCells"] = {
  "t-1-23": "red",
  "t-2-17": "red",
  "t-2-19": "red",
  "t-2-21": "red",
  "t-2-24": "red",
  "t-3-17": "red",
  "t-3-19": "red",
  "t-3-21": "red",
  "t-3-24": "red",
  "t-4-24": "red",
  "t-5-22": "red",
  "t-5-20": "red",
  "t-6-21": "red",
};

describe(`${mapCellPotentials.name}`, () => {
  const potentials = mapCellPotentials(capturedCells, "red");
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
