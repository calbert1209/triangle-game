import {
  findEdgeCells,
  findEnclosedUnownedCells,
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
      expect(outsideCells.size).toBe(71);
    });

    it("should not contain the players captured cells", () => {
      expect(outsideCells.has("t-1-1")).toBe(false);
    });
  });

  describe("when only some cells are enclosed", () => {
    const capturedCells: TriangleGameState["capturedCells"] = {
      "t-0-4": playerId,
      "t-0-8": playerId,
      "t-1-2": playerId,
      "t-1-6": playerId,
      "t-1-10": playerId,
      "t-2-2": playerId,
      "t-2-6": playerId,
      "t-2-10": playerId,
      "t-3-0": playerId,
      "t-3-4": playerId,
      "t-3-8": 1,
      "t-3-9": 1,
      "t-3-10": 1,
      "t-4-4": playerId,
      "t-4-9": 1,
      "t-5-2": playerId,
    };

    const outsideCells = findOutsideCells(
      capturedCells,
      playerId,
      sampleRows,
      sampleCols
    );

    it("should have correct size", () => {
      expect(outsideCells.size).toBe(54);
    });

    it("should not cells enclosed by the player's cells", () => {
      const enclosedCells: TriangleId[] = [
        "t-1-3",
        "t-1-4",
        "t-1-5",
        "t-2-3",
        "t-2-4",
        "t-2-5",
      ];
      for (const cellId of enclosedCells) {
        expect(outsideCells.has(cellId)).toBe(false);
      }
    });

    it("should contain cells owned by another player", () => {
      const otherPlayerCells = (
        Object.keys(capturedCells) as TriangleId[]
      ).filter((cellId) => capturedCells[cellId] !== playerId);

      for (const cellId of otherPlayerCells) {
        expect(outsideCells.has(cellId)).toBe(true);
      }
    });

    it("should contain cells encircled by two players cells", () => {
      const encircledCells: TriangleId[] = [
        "t-1-7",
        "t-1-8",
        "t-1-9",
        "t-2-7",
        "t-2-8",
        "t-2-9",
      ];
      for (const cellId of encircledCells) {
        expect(outsideCells.has(cellId)).toBe(true);
      }
    });

    it("should contain cells almost encircled by players cells", () => {
      const encircledCells: TriangleId[] = [
        "t-3-1",
        "t-3-2",
        "t-3-3",
        "t-4-1",
        "t-4-2",
        "t-4-3",
      ];
      for (const cellId of encircledCells) {
        expect(outsideCells.has(cellId)).toBe(true);
      }
    });
  });
});

describe(`${findEnclosedUnownedCells.name}`, () => {
  const capturedCells: TriangleGameState["capturedCells"] = {
    "t-0-2": playerId,
    "t-0-4": playerId,
    "t-1-0": playerId,
    "t-1-6": playerId,
    "t-2-0": playerId,
    "t-2-6": playerId,
    "t-3-2": playerId,
    "t-3-4": playerId,
  };

  const enclosed = findEnclosedUnownedCells(capturedCells, playerId, 4, 7);
  const expectedIds: TriangleId[] = [
    "t-1-1",
    "t-1-2",
    "t-1-3",
    "t-1-4",
    "t-1-5",
    "t-2-1",
    "t-2-2",
    "t-2-3",
    "t-2-4",
    "t-2-5",
  ];

  it("should have a size equal to the enclosed, unknown cells", () => {
    expect(enclosed.size).toEqual(expectedIds.length);
  });
  it("should include the enclosed, unowned cells", () => {
    for (const cellId of expectedIds) {
      expect(enclosed.has(cellId)).toBe(true);
    }
  });
});
