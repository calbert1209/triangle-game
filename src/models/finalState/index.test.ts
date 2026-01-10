import { getFinalState, getScores } from ".";
import { TriangleId } from "../Triangle";

const triangleIds: TriangleId[] = [
  "t-0-0",
  "t-0-1",
  "t-0-2",
  "t-0-3",
  "t-0-4",
  "t-1-0",
  "t-1-1",
  "t-1-2",
  "t-2-0",
  "t-2-1",
];

describe(`${getScores.name}`, () => {
  it("should return sorted scores", () => {
    const result = getScores({
      capturedCells: {
        [triangleIds[0]]: 0,
        [triangleIds[1]]: 1,
        [triangleIds[2]]: 1,
        [triangleIds[3]]: 0,
        [triangleIds[4]]: 2,
        [triangleIds[5]]: 1,
      },
      stagedCells: [triangleIds[7], triangleIds[6]],
      currentPlayer: "1",
    });

    expect(result).toEqual([
      ["1", 5],
      ["0", 2],
      ["2", 1],
    ]);
  });
});

describe(`${getFinalState.name}`, () => {
  describe("when there is a winner in a 3-player game", () => {
    const result = getFinalState({
      capturedCells: {
        [triangleIds[0]]: 0,
        [triangleIds[1]]: 1,
        [triangleIds[2]]: 1,
        [triangleIds[3]]: 0,
        [triangleIds[4]]: 2,
        [triangleIds[5]]: 1,
      },
      stagedCells: [triangleIds[7], triangleIds[6]],
      currentPlayer: "1",
      numPlayers: 3,
    });

    it("should return the winner", () => {
      expect(result.winner).toBe(1);
    });

    it("should return the scores", () => {
      expect(result.scores).toEqual({
        "0": 2,
        "1": 5,
        "2": 1,
      });
    });
  });

  describe("when there is a tie in a 3-player game", () => {
    const result = getFinalState({
      capturedCells: {
        [triangleIds[0]]: 0,
        [triangleIds[1]]: 1,
        [triangleIds[2]]: 1,
        [triangleIds[3]]: 0,
        [triangleIds[4]]: 0,
        [triangleIds[5]]: 0,
        [triangleIds[9]]: 2,
      },
      stagedCells: [triangleIds[7], triangleIds[6]],
      currentPlayer: "1",
      numPlayers: 2,
    });

    it("should return the winner", () => {
      expect(result.winner).toBe(-1);
    });

    it("should return the scores", () => {
      expect(result.scores).toEqual({
        "0": 4,
        "1": 4,
        "2": 1,
      });
    });
  });

  describe("when there is a tie in a 2-player game", () => {
    const result = getFinalState({
      capturedCells: {
        [triangleIds[0]]: 0,
        [triangleIds[1]]: 1,
        [triangleIds[2]]: 1,
        [triangleIds[3]]: 0,
        [triangleIds[4]]: 0,
        [triangleIds[5]]: 0,
      },
      stagedCells: [triangleIds[7], triangleIds[6]],
      currentPlayer: "1",
      numPlayers: 2,
    });

    it("should return the winner", () => {
      expect(result.winner).toBe(-1);
    });

    it("should return the scores", () => {
      expect(result.scores).toEqual({
        "0": 4,
        "1": 4,
        "2": 0,
      });
    });
  });
});
