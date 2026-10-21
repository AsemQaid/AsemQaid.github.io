// Publications, newest first. Copy the example below (remove the // marks) to add one.
// The Research page switches from "No publications yet" to the list automatically.
export type Publication = {
  year: number;
  title: string;
  authors: string;            // your name as "A. A. Qaid" is shown in bold
  venue: string;              // journal or conference, volume, pages
  links: { label: string; url: string }[];  // e.g. PDF, DOI, Slides
};

export const PUBLICATIONS: Publication[] = [
  // {
  //   year: 2027,
  //   title: "Title of the paper as published",
  //   authors: "A. A. Qaid, F. Y. M. Abbaker, Firdaus",
  //   venue: "Proceedings of ..., pp. 1–6",
  //   links: [{ label: "PDF", url: "/papers/qaid-2027.pdf" }, { label: "DOI", url: "https://doi.org/..." }],
  // },
];
