# AGENTS.md

This file provides guidance for AI coding agents working in the **triangle-game** (**Hikuidori**) repository.

---

## Project Overview

**Hikuidori (`triangle-game`)** is a 2-to-3 player turn-based territory-capture board game played on a grid of alternating upward and downward triangles. Players roll a 6-sided die to determine how many cells (`tries`) they must stage on their turn, and any unowned regions completely enclosed by a single player's cells are automatically captured (flood-filled) when the turn is committed.

### Tech Stack
- **UI Framework**: [Preact](https://preactjs.com/) (`^10.26.9`) with `preact/compat` aliasing for React compatibility
- **Game Engine**: [`boardgame.io`](https://boardgame.io/) (`^0.50.2`) using `boardgame.io/react` client
- **Language**: TypeScript (`~5.9.3`)
- **Build Tool**: Vite (`^7.0.4`) with `@preact/preset-vite`
- **Test Runner**: Vitest (`^4.0.16`) with `globals: true`
- **Node Version**: `22.12.0` (see `.node-version`)

---

## Commands & Workflows

| Task | Command | Notes |
| :--- | :--- | :--- |
| **Install dependencies** | `npm install` | Required before running dev, build, test, or typecheck |
| **Start dev server** | `npm run dev` | Runs `vite` at `http://localhost:5173/` (`base: "/"`) |
| **Run tests (one-shot)** | `npm test -- --run` | **Preferred for agents.** Bare `npm test` runs `vitest`, which enters watch mode in interactive terminals |
| **Run tests (watch)** | `npm run test:watch` | Interactive watch mode |
| **Typecheck** | `npx tsc --noEmit` | Validates TypeScript across `src/` and tests |
| **Production build** | `npm run build` | Outputs to `dist/` with `base: "/triangle-game/"` for GitHub Pages |
| **Preview build** | `npm run preview` | Serves the production build locally |

### Runtime URL Query Parameters
The app configures the game client via URL query parameters in `src/components/TriangleGameApp.tsx`:
- `?players=3`: Enables 3-player mode (Red, Blue, Green). Defaults to `2` players (Red, Blue) when omitted or set to any other value.
- `?mobile=true`: Uses mobile board dimensions (`20` rows × `19` cols). Defaults to desktop dimensions (`14` rows × `37` cols).

---

## Repository Structure

```text
triangle-game/
├── .github/workflows/
│   └── build-and-deploy.yml       # CI/CD: builds and deploys dist/ to gh-pages branch on push to main
├── index.html                     # App entry HTML (title: "Hikuidori", mounts #app)
├── poc/                           # Legacy vanilla JS/HTML prototype (served via poc/serve.py on port 7528; not part of Vite build)
├── public/                        # Static assets (favicon.png, vite.svg)
├── src/
│   ├── index.tsx                  # Mounts <TriangleGameApp /> into #app
│   ├── style.css                  # Global styles, color variables, clip-path bevels & triangle button styles
│   ├── components/
│   │   ├── TriangleGameApp.tsx    # Reads URL params (?players, ?mobile) and creates boardgame.io Client
│   │   ├── GameContext.tsx        # Preact Context wrapping BoardProps<TriangleGameState> + memoized Triangle[]
│   │   ├── GameSurface.tsx        # Top-level layout (<GameHeader /> + <GameBoard /> or gameover banner)
│   │   ├── Header.tsx             # Player score counters and turn stage action buttons (Roll, Undo, Capture)
│   │   ├── GameBoard.tsx          # SVG board renderer, viewBox calculation, cell click & fill handlers
│   │   ├── Cell.tsx               # Renders individual SVG <use> element referencing #triangle or #triangle-down
│   │   └── Icons.tsx              # SVG icon components (CheckMarkIcon, UndoIcon, DiceIcon)
│   └── models/
│       ├── Game.ts                # boardgame.io Game factory (createTriangleGame), state interface, turn stages, endIf/onEnd
│       ├── moves.ts               # Move functions: rollDice, pickCell, revertPickCells, captureCells
│       ├── Triangle.ts            # TriangleId type, coordinate parsing, neighbor calculation, up/down orientation
│       ├── triangle.test.ts       # Unit tests for Triangle coordinate parsing
│       ├── colors.ts              # COLOR_MAP and getCellColorHex() helper for cell states
│       ├── constants.ts           # Board dimensions (DIMENSIONS, MOBILE_DIMENSIONS) and SVG offset constants
│       ├── fillableGroup/
│       │   ├── index.ts           # BFS territory enclosure algorithms (findEdgeCells, findOutsideCells, findFillableGroup)
│       │   └── index.test.ts      # Unit tests for edge, outside, and enclosed cell detection
│       └── finalState/
│           ├── index.ts           # Score aggregation (getScores) and winner/tie evaluation (getFinalState)
│           └── index.test.ts      # Unit tests for scoring and 2/3-player win/tie states
├── tsconfig.json                  # TypeScript config with Preact JSX and react -> preact/compat path mappings
└── vite.config.ts                 # Vite + Vitest configuration
```

---

## Core Architecture & Domain Mechanics

### 1. Triangular Grid Geometry (`src/models/Triangle.ts`)
- **Cell IDs**: Represented by the template literal type `TriangleId = \`t-${number}-${number}\`` (`t-<row>-<col>`).
- **Orientation**: Determined by parity of `(row + col) % 2`:
  - Even (`0`): `"up"` (`▲`)
  - Odd (`1`): `"down"` (`▼`)
- **Adjacency (`neighborIds`)**: Every triangle has up to 3 neighbors sharing an edge:
  - Left (`[row, col - 1]`) and Right (`[row, col + 1]`)
  - Vertical neighbor depends on orientation:
    - `"up"` triangles share a base with `[row + 1, col]` below them.
    - `"down"` triangles share a top edge with `[row - 1, col]` above them.
- **SVG Positioning (`src/components/Cell.tsx`, `src/components/GameBoard.tsx`)**:
  - `x = col * 25`, `y = row * 42 - 100`.
  - Uses `<defs>` paths `#triangle` (upward) and `#triangle-down` (downward) instantiated with `<use>`.

### 2. Sentinel Edge Ring & Playable Area (`src/models/fillableGroup/index.ts`)
- The outermost border of the grid (`row === 0`, `row === boardRows - 1`, `col === 0`, `col === boardCols - 1`) is a **sentinel ring** returned by `findEdgeCells(rows, cols)`.
- **Playable cells**: Only interior cells are playable and rendered (`(boardRows - 2) * (boardCols - 2)` total triangles).
  - Desktop (`14 × 37`): `12 × 35 = 420` playable triangles.
  - Mobile (`20 × 19`): `18 × 17 = 306` playable triangles.
- `GameBoard.tsx` filters out `edgeCells` so they are not rendered in the SVG, and ignores clicks on any ID in `edgeCells`.
- **Why the sentinel ring exists**: `findOutsideCells` seeds its breadth-first search (BFS) queue with all `edgeCells` plus all cells owned by opponents (`owner !== playerId`). Because edge cells cannot be captured by any player, any group of unowned cells that is *only* bounded by the board edge (and not fully surrounded by the current player's own cells) remains reachable from `edgeCells` and will **not** be falsely marked as enclosed.

### 3. Enclosure / Auto-Fill Algorithm (`src/models/fillableGroup/index.ts`)
1. `findOutsideCells(capturedCells, playerId, rows, cols)`:
   - Starts a BFS from all `edgeCells` and all cells captured by other players (`owner !== playerId`).
   - Traverses across neighboring triangles as long as `capturedCells[neighborId] !== playerId`.
   - Any cell reached is marked as "outside" (cannot be enclosed by `playerId`).
2. `findFillableGroup(capturedCells, playerId, rows, cols)`:
   - Scans all board coordinates and collects every cell that is **not** in `outsideCells` and is currently unowned (`capturedCells[cellId] === undefined`).
   - Note: If an enclosed region contains even a single cell owned by another player, the BFS from `otherPlayersCells` floods that region as "outside", preventing capture of mixed regions.

### 4. Game State & Turn Lifecycle (`src/models/Game.ts`, `src/models/moves.ts`)
`TriangleGameState` (`G`) tracks:
- `capturedCells: Record<TriangleId, number>` — Permanent map of cell ID to player index (`0`, `1`, or `2`).
- `tries: number` — Current dice roll (`1`–`6`) indicating how many cells the active player must stage.
- `stagedCells: TriangleId[]` — Cells selected by the current player during the `"pick"` stage.
- `fillableGroup: TriangleId[]` — Auto-detected enclosed cells resulting from `capturedCells + stagedCells`.
- `boardRows: number`, `boardCols: number` — Grid dimensions including the 1-cell sentinel border on all sides.

**Turn Stages**:
1. **`roll` stage**: Active at the start of a turn. Only `rollDice` is allowed, which sets `G.tries` (1–6) and advances to the `pick` stage via `events.endStage()`.
2. **`pick` stage**:
   - `pickCell(id)`: Toggles `id` in `G.stagedCells`. Returns `INVALID_MOVE` if `id` is already in `G.capturedCells` or if `G.stagedCells.length >= G.tries` when adding a new cell. Recomputes `G.fillableGroup` on every toggle.
   - `revertPickCells()`: Clears `G.stagedCells` and `G.fillableGroup`.
   - `captureCells()`: Requires `G.stagedCells.length === G.tries` (otherwise returns `INVALID_MOVE`). Moves all IDs from `G.stagedCells` and `G.fillableGroup` into `G.capturedCells` under the current player's ID and calls `events.endTurn()`.

**End-of-Game Detection (`endIf` & `onEnd`)**:
- Checked automatically by `boardgame.io` after each state update.
- Triggers when `totalCaptured + stagedCells.length + fillableGroup.length >= (boardRows - 2) * (boardCols - 2)` (i.e., the current player's staged + fillable cells fill the remainder of the board, even before pressing Capture).
- `onEnd` flushes remaining `stagedCells` and `fillableGroup` into `capturedCells` so final board counts reflect the last move.
- `getFinalState` (`src/models/finalState/index.ts`) computes player scores; if 1st and 2nd place tie, `winner` is `-1` (`{ draw: true }`), otherwise `{ winner: "<playerIndex>" }`.

### 5. Player Mapping & Styling (`src/models/colors.ts`, `src/style.css`)
- Players are indexed `"0"`, `"1"`, `"2"` by `boardgame.io`:
  - Player `0`: **Red** (`#ff5252`, staged: `#ff8a80`)
  - Player `1`: **Blue** (`#3d5afe`, staged: `#8c9eff`)
  - Player `2`: **Green** (`#00e676`, staged: `#69f0ae`)
- UI counters and action buttons in `src/components/Header.tsx` use alternating `.upward` and `.downward` CSS classes with `clip-path: polygon(...)` to visually interlock like the game grid.

---

## Coding Conventions & Guidelines for Agents

1. **Preact / React Compatibility**:
   - `tsconfig.json` maps `react` and `react-dom` to `preact/compat` so `boardgame.io/react` works seamlessly.
   - Import hooks from `"preact/hooks"` (`useMemo`, `useCallback`, `useContext`) and core APIs from `"preact"` (`render`, `createContext`, `ComponentChildren`).
2. **State Mutation in `boardgame.io` Moves**:
   - `boardgame.io` wraps moves in Immer. Inside move functions (`src/models/moves.ts`) and lifecycle hooks (`onEnd`), mutate `G` directly (e.g., `G.stagedCells.push(id)`) or return `INVALID_MOVE` from `"boardgame.io/core"`.
   - Pure helper functions in `src/models/` (`Triangle.ts`, `fillableGroup/`, `finalState/`, `colors.ts`) should remain pure and free of UI/DOM dependencies so they can be unit tested directly.
3. **Writing & Running Tests**:
   - Place unit tests alongside models (`*.test.ts` or `<module>/index.test.ts`).
   - `describe`, `it`, and `expect` are globally available via Vitest (`globals: true` in `vite.config.ts`); no explicit import from `"vitest"` is needed.
   - Always run `npm test -- --run` and `npx tsc --noEmit` to verify changes before finishing a task.
4. **Known Caveats & TODOs in Codebase**:
   - `GameContext.tsx` and `GameBoard.tsx` memoize `triangles`, `edgeCells`, and `newViewBox` with empty dependency arrays `[]` (marked with `// TODO: deal with dynamic board size`). If adding dynamic in-app board resizing without a page reload, update those dependency arrays to include `G.boardRows` and `G.boardCols`.
   - `poc/` is a historical prototype and is not imported by `src/`. Do not modify `poc/` unless specifically requested.
