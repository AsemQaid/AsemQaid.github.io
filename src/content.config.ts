import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Validation levels, lowest to highest. "planned" and "note" are used only inside the verification panel.
const level = z.enum(["designed", "simulated", "prototyped", "tested", "deployed", "planned", "note"]);

const projects = defineCollection({
  // One Markdown file per project per language: src/content/projects/en/<id>.md and src/content/projects/ar/<id>.md
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    number: z.string(),                       // e.g. AAQ-P08 — sets the order (newest first)
    domain: z.enum(["energy", "iot", "control", "measure", "software"]),
    year: z.number(),
    status: level,                            // overall validation level (software, if hardware is listed separately)
    hardwareStatus: level.optional(),
    featured: z.boolean().default(false),     // show on the homepage
    inProgress: z.boolean().default(false),
    draft: z.boolean().default(false),        // true = hidden from the site
    cover: z.string(),
    summary: z.string(),
    lede: z.string(),
    tags: z.array(z.string()).default([]),
    facts: z.array(z.object({ label: z.string(), value: z.string() })),
    verification: z.array(z.object({ label: z.string(), status: level, text: z.string() })),
    shown: z.array(z.string()).optional(),
    limits: z.array(z.string()).optional(),
    resources: z.array(z.object({ type: z.string(), label: z.string(), host: z.string(), url: z.string() })).default([]),
  }),
});

export const collections = { projects };
