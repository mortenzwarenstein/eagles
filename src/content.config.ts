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
			/** `href` is a page slug (made locale-relative) or an in-page "#anchor". */
			primaryCta: z.object({ label: z.string(), href: z.string() }),
			secondaryCta: z.object({ label: z.string(), href: z.string() }),
		}),
		results: z.object({
			kicker: z.string(),
			title: z.string(),
			linkLabel: z.string(),
			page: z.object({ pageTitle: z.string(), pageIntro: z.string(), metaTitle: z.string(), metaDescription: z.string() }),
		}),
		fixtures: z.object({
			kicker: z.string(),
			title: z.string(),
			intro: z.string(),
			linkLabel: z.string(),
			page: z.object({ pageTitle: z.string(), pageIntro: z.string(), metaTitle: z.string(), metaDescription: z.string() }),
		}),
		join: z.object({
			kicker: z.string(),
			title: z.string(),
			intro: z.string(),
			form: z.record(z.string(), z.string()),
		}),
		contact: z.object({
			kicker: z.string(),
			title: z.string(),
			intro: z.string(),
			page: z.object({ pageTitle: z.string(), pageIntro: z.string(), metaTitle: z.string(), metaDescription: z.string() }),
			board: z.object({
				title: z.string(),
				intro: z.string(),
				lastMinute: z.string(),
				members: z.array(z.object({ role: z.string(), name: z.string(), phone: z.string(), email: z.string() })),
			}),
			postal: z.object({ title: z.string(), lines: z.array(z.string()) }),
			venue: z.object({
				title: z.string(),
				text: z.string(),
				lines: z.array(z.string()),
				lon: z.number(),
				lat: z.number(),
				mapQuery: z.string(),
				mapTitle: z.string(),
				mapLinkLabel: z.string(),
			}),
		}),
	}),
})

export const collections = { home }
