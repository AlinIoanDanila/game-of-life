import React, { useCallback, useEffect, useRef, useState } from "react";
import produce from "immer";

const numOfRows = 50;
const numOfCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numOfRows; i++) {
    rows.push(Array.from(Array(numOfCols), () => 0));
  }

  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  useEffect(() => {
    document.title = "Game of life";
  }, []);

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numOfRows; ++i) {
          for (let j = 0; j < numOfCols; ++j) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (
                newI >= 0 &&
                newI < numOfRows &&
                newJ >= 0 &&
                newJ < numOfCols
              ) {
                neighbors += g[newI][newJ];
              }
            });
            if (neighbors < 2 || neighbors > 3) gridCopy[i][j] = 0;
            else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 150);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numOfRows; i++) {
            rows.push(
              Array.from(Array(numOfCols), () => (Math.random() > 0.7 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
      >
        random values
      </button>
      <button onClick={() => setGrid(generateEmptyGrid())}>clear</button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numOfCols},20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((cols, j) => (
            <div
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              key={`${i}-${j}`}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "black" : undefined,
                border: "solid 1px black",
              }}
            ></div>
          ))
        )}
      </div>
    </>
  );
};

export default App;
