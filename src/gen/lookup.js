// Grid-based spatial lookups on a jittered-grid mesh (no triangulation needed, safe for the main thread).
// Site i sits in grid cell (i % cols, i / cols), displaced at most 0.4 of a cell, so the
// nearest site to any point is always within the surrounding 5x5 grid cells.
export function findCell(M, px, py) {
  const { cols, rows, sx, sy, x, y } = M;
  const c0 = Math.min(cols - 1, Math.max(0, Math.floor(px / sx))), r0 = Math.min(rows - 1, Math.max(0, Math.floor(py / sy)));
  let best = r0 * cols + c0, bd = Infinity;
  for (let r = Math.max(0, r0 - 2); r <= Math.min(rows - 1, r0 + 2); r++) {
    for (let c = Math.max(0, c0 - 2); c <= Math.min(cols - 1, c0 + 2); c++) {
      const i = r * cols + c, dx = x[i] - px, dy = y[i] - py, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = i; }
    }
  }
  return best;
}

// visit every cell whose site could lie inside the rectangle
export function forCellsInRect(M, x0, y0, x1, y1, fn) {
  const { cols, rows, sx, sy } = M;
  const c0 = Math.max(0, Math.floor(x0 / sx) - 1), c1 = Math.min(cols - 1, Math.floor(x1 / sx) + 1);
  const r0 = Math.max(0, Math.floor(y0 / sy) - 1), r1 = Math.min(rows - 1, Math.floor(y1 / sy) + 1);
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) fn(r * cols + c);
}
