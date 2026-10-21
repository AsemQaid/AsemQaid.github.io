import { getCollection, type CollectionEntry } from "astro:content";

export type Lang = "en" | "ar";
export const PROFILE = {
  nameEn: "Asem Ameen Qaid",
  nameAr: "عاصم أمين قائد",
  email: "asemqaid.ee@gmail.com",
  linkedin: "https://www.linkedin.com/in/asem-qaid-b49311263/",
  linkedinShort: "linkedin.com/in/asem-qaid-b49311263",
  github: "https://github.com/AsemQaid",
  githubShort: "github.com/AsemQaid",
  cv: "/cv/Asem-Ameen-Qaid_CV.pdf",
  revision: "Rev 1.0 · 2026-10-21",
};

/** Pick the English or Arabic string. */
export const tr = (lang: Lang) => (en: string, ar: string) => (lang === "ar" ? ar : en);

/** Build a path for a language: url("ar", "/work/") -> "/ar/work/" */
export const url = (lang: Lang, path = "/") => (lang === "ar" ? "/ar" + path : path);

export const STATUS: Record<string, { en: string; ar: string }> = {
  designed: { en: "Designed", ar: "مُصمَّم" },
  simulated: { en: "Simulated", ar: "مُحاكى" },
  prototyped: { en: "Prototyped", ar: "نموذج مبني" },
  tested: { en: "Tested", ar: "مُختبَر" },
  deployed: { en: "Deployed", ar: "منشور ويعمل" },
  planned: { en: "Not yet shown", ar: "لم يُثبت بعد" },
  note: { en: "Disclosure", ar: "إفصاح" },
};
export const LEVELS = ["designed", "simulated", "prototyped", "tested", "deployed"] as const;

export const DOMAINS: Record<string, { en: string; ar: string }> = {
  energy: { en: "Energy systems", ar: "أنظمة الطاقة" },
  iot: { en: "Embedded & IoT", ar: "الأنظمة المدمجة وإنترنت الأشياء" },
  control: { en: "Microprocessors & control", ar: "المعالجات الدقيقة والتحكم" },
  measure: { en: "Measurement & sensing", ar: "القياس والاستشعار" },
  software: { en: "Engineering software", ar: "البرمجيات الهندسية" },
};

export type Project = CollectionEntry<"projects"> & { slug: string; lang: Lang; fallback: boolean };

/**
 * All projects for a language, newest first. If an Arabic file is missing,
 * the English one is used and marked as a fallback.
 */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const all = await getCollection("projects", ({ data }) => !data.draft);
  const split = (e: CollectionEntry<"projects">) => {
    const [l, ...rest] = e.id.split("/");
    return { l: l as Lang, slug: rest.join("/") };
  };
  const en = all.filter((e) => split(e).l === "en");
  const out = en.map((e) => {
    const slug = split(e).slug;
    const local = lang === "ar" ? all.find((x) => split(x).l === "ar" && split(x).slug === slug) : e;
    return { ...(local ?? e), slug, lang, fallback: !local } as Project;
  });
  return out.sort((a, b) => b.data.number.localeCompare(a.data.number));
}
