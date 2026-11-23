import type { APIRoute } from "astro"

/**
 * Sitemap with NL/EN alternates (hreflang). Add a row when a new page is added.
 * Each entry is [Dutch path, English path]; the Dutch locale lives at the root.
 */
const PAGES: [nl: string, en: string][] = [
	["/", "/en/"],
	["/uitslagen/", "/en/uitslagen/"],
	["/programma/", "/en/programma/"],
	["/inschrijven/", "/en/inschrijven/"],
]

export const GET: APIRoute = ({ site }) => {
	const origin = (site ?? new URL("https://utrechteagles.nl")).origin
	const url = (path: string) => `${origin}${path}`

	const entries = PAGES.flatMap(([nl, en]) =>
		[nl, en].map(
			(path) => `  <url>
    <loc>${url(path)}</loc>
    <xhtml:link rel="alternate" hreflang="nl" href="${url(nl)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${url(en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url(nl)}"/>
  </url>`,
		),
	)

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`
	return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } })
}
