/** 1 … 4 5 6 … 20: first, last and the pages around the current one. */
export function pageItems(current: number, total: number): (number | "gap")[] {
  const pages = new Set([1, total, current - 1, current, current + 1].filter((n) => n >= 1 && n <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] === 2) items.push(n - 1); // a single hidden page: just show it
    else if (i > 0 && n - sorted[i - 1] > 2) items.push("gap");
    items.push(n);
  });
  return items;
}
