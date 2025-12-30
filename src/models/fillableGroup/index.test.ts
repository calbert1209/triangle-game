import { findFillableGroup, mapCellPotentials } from ".";
import { TriangleGameState } from "../Game";
import { TriangleId } from "../Triangle";

const playerId = 0;
const capturedCells: TriangleGameState["capturedCells"] = {
  "t-1-23": playerId,
  "t-2-17": playerId,
  "t-2-19": playerId,
  "t-2-21": playerId,
  "t-2-24": playerId,
  "t-3-17": playerId,
  "t-3-19": playerId,
  "t-3-21": playerId,
  "t-3-24": playerId,
  "t-4-24": playerId,
  "t-5-22": playerId,
  "t-5-20": playerId,
  "t-6-21": playerId,
};

describe(`${mapCellPotentials.name}`, () => {
  const potentials = mapCellPotentials(capturedCells, playerId);
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

describe(`${findFillableGroup.name}`, () => {
  const fillableGroup = findFillableGroup(capturedCells, playerId);
  it("should have correct size", () => {
    expect(fillableGroup.length).toBe(5);
  });
  it("should contain specific cells", () => {
    const expectedCells = ["t-2-18", "t-2-20", "t-3-18", "t-3-20", "t-5-21"];

    for (const cellId of expectedCells) {
      expect(fillableGroup).toContain(cellId);
    }
  });
});
