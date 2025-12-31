import {
  findEdgeCells,
  findFillableGroup,
  findOutsideCells,
  mapCellPotentials,
} from ".";
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

const sampleRows = 6;
const sampleCols = 12;

describe(`${findEdgeCells.name}`, () => {
  const edgeCells = findEdgeCells(sampleRows, sampleCols);
  const expectedEdgeCells = new Set<TriangleId>([
    "t-0-0",
    "t-0-1",
    "t-0-2",
    "t-0-3",
    "t-0-4",
    "t-0-5",
    "t-0-6",
    "t-0-7",
    "t-0-8",
    "t-0-9",
    "t-0-10",
    "t-0-11",
    "t-1-0",
    "t-1-11",
    "t-2-0",
    "t-2-11",
    "t-3-0",
    "t-3-11",
    "t-4-0",
    "t-4-11",
    "t-5-0",
    "t-5-1",
    "t-5-2",
    "t-5-3",
    "t-5-4",
    "t-5-5",
    "t-5-6",
    "t-5-7",
    "t-5-8",
    "t-5-9",
    "t-5-10",
    "t-5-11",
  ]);

  it("should have correct size", () => {
    expect(edgeCells.size).toBe(expectedEdgeCells.size);
  });

  it("should contain specific cells", () => {
    for (const cellId of expectedEdgeCells) {
      expect(edgeCells.has(cellId)).toBe(true);
    }
  });
});

describe(`${findOutsideCells.name}`, () => {
  describe("when used in a basic situation", () => {
    const capturedCells: TriangleGameState["capturedCells"] = {
      "t-1-1": playerId,
      "t-1-6": 1,
      "t-2-4": 2,
    };

    const outsideCells = findOutsideCells(
      capturedCells,
      playerId,
      sampleRows,
      sampleCols
    );

    it("should have correct size", () => {
      expect(outsideCells.size).toBe(69);
    });

    it("should not contain the captured cells", () => {
      for (const cellId of Object.keys(capturedCells)) {
        expect(outsideCells.has(cellId as TriangleId)).toBe(false);
      }
    });
  });
});
