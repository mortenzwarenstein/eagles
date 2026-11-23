import type { APIRoute } from "astro"

/** robots.txt, generated so the Sitemap URL follows the `site` configured for this build (SITE env). */
export const GET: APIRoute = ({ site }) => {
	const origin = (site ?? new URL("https://utrechteagles.nl")).origin
	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	})
}
