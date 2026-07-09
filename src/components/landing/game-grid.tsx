type TileState = "correct" | "present" | "absent" | "empty";

interface Cell {
  letter: string;
  state: TileState;
}

const ROWS: Cell[][] = [
  [{ letter: "C", state: "correct" }, { letter: "L", state: "absent" }, { letter: "A", state: "absent" }, { letter: "I", state: "absent" }, { letter: "M", state: "absent" }],
  [{ letter: "C", state: "correct" }, { letter: "H", state: "present" }, { letter: "E", state: "absent" }, { letter: "C", state: "absent" }, { letter: "K", state: "absent" }],
  [{ letter: "C", state: "correct" }, { letter: "H", state: "correct" }, { letter: "I", state: "correct" }, { letter: "P", state: "correct" }, { letter: "S", state: "correct" }],
  Array(5).fill(null).map(() => ({ letter: "", state: "empty" as TileState })),
  Array(5).fill(null).map(() => ({ letter: "", state: "empty" as TileState })),
  Array(5).fill(null).map(() => ({ letter: "", state: "empty" as TileState })),
];

const CELL = 40;
const GAP = 4;
const STEP = CELL + GAP;
const R = 6;
const PAD = 8;

const W = 5 * STEP + PAD * 2;
const H = 6 * STEP + PAD * 2;

function colorVar(state: TileState): string {
  switch (state) {
    case "correct": return "var(--tile-correct-bg)";
    case "present": return "var(--tile-present-bg)";
    default: return "transparent";
  }
}

function textColor(state: TileState): string {
  switch (state) {
    case "correct": return "var(--tile-correct-text)";
    case "present": return "var(--tile-present-text)";
    default: return "var(--ink-muted)";
  }
}

function strokeColor(state: TileState): string {
  switch (state) {
    case "absent": return "var(--tile-absent-bg)";
    default: return "var(--tile-border)";
  }
}

export function GameGridPreview() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full max-w-[220px] h-auto"
      aria-label="Word game grid preview showing a solved puzzle for the word CHIPS"
    >
      {ROWS.map((row, r) =>
        row.map((cell, c) => {
          const x = PAD + c * STEP;
          const y = PAD + r * STEP;
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                rx={R}
                fill={cell.state === "absent" ? "var(--tile-absent-bg)" : colorVar(cell.state)}
                stroke={strokeColor(cell.state)}
                strokeWidth={cell.state === "empty" ? 1.5 : 0}
              />
              {cell.letter && (
                <text
                  x={x + CELL / 2}
                  y={y + CELL / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={textColor(cell.state)}
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="20"
                  fontWeight="700"
                >
                  {cell.letter}
                </text>
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}
