// Seven-segment display, drawn as inline SVG. Used by the focus readout, the measurement badge and the logbook counter.
// Works on the server (Astro set:html) and in the browser (site.ts), so both render identical markup.
//
//    aaa
//   f   b
//    ggg
//   e   c
//    ddd  .

const SEG: Record<string, string> = {
  a: "M2.4 1.2H7.6", b: "M8.8 2.4V7.8", c: "M8.8 10.2V15.6", d: "M2.4 16.8H7.6",
  e: "M1.2 10.2V15.6", f: "M1.2 2.4V7.8", g: "M2.4 9H7.6",
};
const MAP: Record<string, string> = {
  "0": "abcdef", "1": "bc", "2": "abdeg", "3": "abcdg", "4": "bcfg", "5": "acdfg",
  "6": "acdefg", "7": "abc", "8": "abcdefg", "9": "abcdfg", "-": "g", " ": "",
};

function digit(ch: string, dot: boolean) {
  const on = MAP[ch] ?? "";
  const segs = Object.entries(SEG).map(([k, d]) => `<path d="${d}" class="${on.includes(k) ? "on" : ""}"/>`).join("");
  return `<svg class="s7d" viewBox="-0.6 0 12.6 18" aria-hidden="true"><g transform="skewX(-6) translate(1.6 0)">${segs}</g>` +
    `<circle cx="10.9" cy="16.8" r="0.95" class="${dot ? "on" : ""}"/></svg>`;
}

/** "0.161" -> four digits, the first with its decimal point lit. */
export function seg7(value: string): string {
  const out: string[] = [];
  const chars = [...value];
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === ".") continue;
    out.push(digit(chars[i], chars[i + 1] === "."));
  }
  return out.join("");
}
