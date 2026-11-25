/**
 * Club logos from the NBB basketball database JSON feed ("clubs").
 * Docs: https://db.basketball.nl/help/koppelingen/json
 *
 * The clubs endpoint sends no CORS headers, so it is fetched at build time and the
 * resulting id -> logo URL map is embedded in the page for the client-side renderer.
 */
const CLUBS_URL = "https://api.basketballstats.nl/db/json/club.pl"

export type ClubLogos = Record<number, string>

interface ApiClub {
	id: number
	logo?: string | null
}

/** Logo URL per club id. Returns an empty map when the feed is unavailable (initials are shown instead). */
export async function fetchClubLogos(): Promise<ClubLogos> {
	try {
		const res = await fetch(CLUBS_URL)
		if (!res.ok) throw new Error(`NBB API responded with ${res.status}`)
		const data = (await res.json()) as { clubs: ApiClub[] }
		return Object.fromEntries(data.clubs.filter((club) => club.logo).map((club) => [club.id, club.logo!]))
	} catch (error) {
		console.warn("Could not load club logos", error)
		return {}
	}
}
