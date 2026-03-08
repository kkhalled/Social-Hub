/**
 * Format date to "Month Year" format
 * @param {string} dateStr - ISO date string
 * @returns {string|null} Formatted date or null
 */
export function formatJoined(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/**
 * Abbreviate large numbers (e.g., 1500 → 1.5K, 1500000 → 1.5M)
 * @param {number} n - Number to abbreviate
 * @returns {string} Abbreviated number
 */
export function abbreviate(n) {
  if (!n && n !== 0) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}
