import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

/**
 * Editorial page content, one JSON file per locale (`home/nl.json`, `home/en.json`).
 * The entry id is the locale. To move to a CMS, swap the `glob` loader for a CMS loader
 * (or point the CMS at these files) and keep the schema, pages stay untouched.
 */
const home = defineCollection({
	loader: glob({ pattern: "*.json", base: "./src/content/home" }),
	schema: z.object({
		meta: z.object({ title: z.string(), description: z.string() }),
		hero: z.object({
			kicker: z.string(),
			title: z.string(),
			titleHighlight: z.string(),
			cta: z.object({ label: z.string(), href: z.string() }),
			intro: z.string(),
		}),
		results: z.object({ kicker: z.string(), title: z.string(), linkLabel: z.string() }),
		fixtures: z.object({
			kicker: z.string(),
			title: z.string(),
			intro: z.string(),
			linkLabel: z.string(),
		}),
	}),
})

export const collections = { home }
