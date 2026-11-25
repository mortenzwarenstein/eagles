/**
 * Club logos from the NBB basketball database JSON feed ("clubs").
 * Docs: https://db.basketball.nl/help/koppelingen/json
 *
 * The clubs endpoint sends no CORS headers, so it is fetched at build time and the
 * resulting id -> logo URL map is embedded in the page for the client-side renderer.
 * The feed sits behind Cloudflare, which blocks CI runners (403), so the build falls back to
 * the committed snapshot in src/data/club-logos.json (refresh it with `npm run update:club-logos`).
 */
import snapshot from "../data/club-logos.json"

const CLUBS_URL = "https://api.basketballstats.nl/db/json/club.pl"

export type ClubLogos = Record<number, string>

interface ApiClub {
	id: number
	logo?: string | null
}

let cached: Promise<ClubLogos> | undefined

async function load(): Promise<ClubLogos> {
	try {
		const res = await fetch(CLUBS_URL)
		if (!res.ok) throw new Error(`NBB API responded with ${res.status}`)
		const data = (await res.json()) as { clubs: ApiClub[] }
		return Object.fromEntries(data.clubs.filter((club) => club.logo).map((club) => [club.id, club.logo!]))
	} catch (error) {
		console.warn("Could not load club logos, using the committed snapshot", error)
		return snapshot
	}
}

/** Logo URL per club id: the live feed, or the committed snapshot when the feed is unavailable. Fetched once per build. */
export function fetchClubLogos(): Promise<ClubLogos> {
	cached ??= load()
	return cached
}
