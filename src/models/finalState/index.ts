import { Ctx } from "boardgame.io";
import { TriangleGameState } from "../Game";

interface GetScoresArgs {
  capturedCells: TriangleGameState["capturedCells"];
  stagedCells: TriangleGameState["stagedCells"];
  currentPlayer: Ctx["currentPlayer"];
}

export const getScores = ({
  capturedCells,
  stagedCells,
  currentPlayer,
}: GetScoresArgs) => {
  const scores: Record<"0" | "1" | "2", number> = { "0": 0, "1": 0, "2": 0 };
  for (const playerId of Object.values(capturedCells)) {
    if (playerId in scores === false) continue;
    scores[playerId] += 1;
  }

  if (currentPlayer in scores) {
    scores[currentPlayer] += stagedCells.length;
  }

  return Object.entries(scores).sort(
    ([_a, aScore], [_b, bScore]) => bScore - aScore
  );
};

interface GetFinalStateArgs extends GetScoresArgs {
  numPlayers: number;
}

export interface FinalState {
  winner: number;
  scores: Record<string, number>;
}

export const getFinalState = ({
  numPlayers,
  ...args
}: GetFinalStateArgs): FinalState => {
  const [first, second, third] = getScores(args);
  const scores = Object.fromEntries([first, second, third]);
  if (first[1] === second[1]) {
    return {
      winner: -1,
      scores,
    };
  }

  return {
    winner: parseInt(first[0], 10),
    scores,
  };
};
