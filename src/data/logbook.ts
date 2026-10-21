// Logbook entries on the homepage, newest first. Add a new line at the top to log something.
// link: a page on this site (without /ar), or leave it out.
const project = { en: "Project", ar: "مشروع" };
const leadership = { en: "Leadership", ar: "قيادة" };
const site = { en: "Site", ar: "الموقع" };

export const LOGBOOK = [
  { date: "2026-10", tag: site, en: "Portfolio website launched, with seven projects and their reports.", ar: "إطلاق موقع الأعمال مع سبعة مشاريع وتقاريرها." },
  { date: "2026-10", tag: project, link: "/work/ee-studio/", en: "EE Studio reaches its first complete milestone: 37 labs, 485 tests, deployed.", ar: "EE Studio يصل إلى أول إصدار مكتمل: 37 مختبرًا و485 اختبارًا، منشور." },
  { date: "2026-10", tag: project, link: "/work/energy-copilot/", en: "Team PowerTech proposal submitted to ANGEL Innovation Hackathon 2026, Sustainable Energy track.", ar: "تقديم مقترح فريق PowerTech لهاكاثون ANGEL للابتكار 2026، مسار الطاقة المستدامة." },
  { date: "2026", tag: leadership, link: "/leadership/", en: "Became President of UII Global.", ar: "تولّيت رئاسة UII Global." },
  { date: "2026", tag: project, link: "/work/panel-protection/", en: "Electrical panel protection system built on a PCB and bench-tested.", ar: "بناء نظام حماية اللوحة الكهربائية على لوحة PCB واختباره على المنضدة." },
  { date: "2026-01", tag: project, link: "/work/dryer-8086/", en: "8086 dryer controller completed and verified in Proteus.", ar: "إكمال متحكم المجفف بالمعالج 8086 والتحقق منه في Proteus." },
];
