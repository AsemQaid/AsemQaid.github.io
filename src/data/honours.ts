// Honours, certificates and memberships on the Leadership page, newest first.
//
// To show a certificate: export it as .webp (about 1600 px wide), upload it to public/certificates/,
// and set `image` to its path. A "View certificate" button appears automatically. Leave `image` out if there is none.
// kind: award | certificate | competition | member

type T = { en: string; ar: string };
export type Honour = { year: string; kind: "award" | "certificate" | "competition" | "member"; title: T; org?: T; image?: string };

export const KIND: Record<Honour["kind"], T> = {
  award: { en: "Award", ar: "جائزة" },
  certificate: { en: "Certificate", ar: "شهادة" },
  competition: { en: "Competition", ar: "مسابقة" },
  member: { en: "Member", ar: "عضو" },
};

export const HONOURS: Honour[] = [
  // Examples to fill in once the result or certificate is in hand (remove the // marks):
  // { year: "2026", kind: "competition", title: { en: "Participant, Huawei Innovation Competition", ar: "مشارك، مسابقة هواوي للابتكار" }, image: "/certificates/huawei-innovation-2026.webp" },
  // { year: "2026", kind: "competition", title: { en: "Finalist, Idea Champion 3.0", ar: "متأهل للنهائي، Idea Champion 3.0" }, org: { en: "CLC, Universitas Islam Indonesia", ar: "CLC، الجامعة الإسلامية الإندونيسية" }, image: "/certificates/idea-champion-2026.webp" },
  // { year: "2026", kind: "certificate", title: { en: "ANGEL Innovation Hackathon 2026, Team PowerTech", ar: "هاكاثون ANGEL للابتكار 2026، فريق PowerTech" }, image: "/certificates/angel-2026.webp" },
  { year: "2020", kind: "award", title: { en: "First Medal, Faris Al-Ilqaa Public Speaking Competition", ar: "الميدالية الأولى، مسابقة فارس الإلقاء" }, org: { en: "Riyadh", ar: "الرياض" } },
  { year: "—", kind: "member", title: { en: "Founding member, Jogja SWUG (SolidWorks User Group)", ar: "عضو مؤسس، مجموعة مستخدمي SolidWorks في جوغجا" } },
  { year: "—", kind: "member", title: { en: "Member, Google Developer Group (GDG)", ar: "عضو، مجموعة مطوري Google" } },
];
