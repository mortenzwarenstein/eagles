/**
 * Client for the NBB basketball database JSON feed.
 * Docs: https://db.basketball.nl/help/koppelingen/json
 */
const API_URL = "https://api.basketballstats.nl/db/json/wedstrijd.pl"
export const CLUB_ID = 28 // UBV "The Eagles"

export interface Match {
	id: number
	/** ISO timestamp (Europe/Amsterdam local time, no offset) */
	date: string
	/** e.g. "Za 19 okt" */
	dateLabel: string
	/** e.g. "20:30" */
	time: string
	home: string
	away: string
	homeIsUs: boolean
	awayIsUs: boolean
	venue: string
	played: boolean
	homeScore?: number
	awayScore?: number
	/** Only set for played matches, from the club's perspective */
	outcome?: "win" | "draw" | "loss"
}

interface ApiMatch {
	id: number
	datum: string // "2026-09-05 10:00:00.000"
	tijd: string
	thuis_ploeg: string
	uit_ploeg: string
	thuis_club_id: number
	uit_club_id: number
	loc_naam: string | null
	loc_plaats: string | null
	score_thuis: string | null
	score_uit: string | null
}

const teamName = (name: string) => name.replace(/^UBV "The Eagles"/, "The Eagles")

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const dateFormat = (locale: string) =>
	new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })

function toMatch(m: ApiMatch, now: Date, format: Intl.DateTimeFormat): Match {
	// Treat the local timestamp as-is; compare against "now" in Amsterdam time.
	const date = m.datum.slice(0, 19).replace(" ", "T")
	const amsterdamNow = new Date(now.toLocaleString("sv-SE", { timeZone: "Europe/Amsterdam" }).replace(" ", "T") + "Z").getTime()
	const homeScore = m.score_thuis == null ? NaN : Number(m.score_thuis)
	const awayScore = m.score_uit == null ? NaN : Number(m.score_uit)
	// The API reports unplayed matches as 0 - 0, so a past match with 0 - 0 counts as not (yet) played.
	const hasScore = !Number.isNaN(homeScore) && !Number.isNaN(awayScore) && homeScore + awayScore > 0
	const played = hasScore && new Date(date + "Z").getTime() <= amsterdamNow
	const homeIsUs = m.thuis_club_id === CLUB_ID
	const match: Match = {
		id: m.id,
		date,
		dateLabel: capitalize(format.format(new Date(date + "Z")).replace(".", "")),
		time: m.tijd,
		home: teamName(m.thuis_ploeg),
		away: teamName(m.uit_ploeg),
		homeIsUs,
		awayIsUs: m.uit_club_id === CLUB_ID,
		venue: [m.loc_naam, m.loc_plaats].filter(Boolean).join(", "),
		played,
	}
	if (played) {
		const [us, them] = homeIsUs ? [homeScore, awayScore] : [awayScore, homeScore]
		match.homeScore = homeScore
		match.awayScore = awayScore
		match.outcome = us > them ? "win" : us < them ? "loss" : "draw"
	}
	return match
}

/** All matches of the club this season, ordered by date. */
export async function fetchMatches(locale = "nl-NL"): Promise<Match[]> {
	const res = await fetch(`${API_URL}?clb_ID=${CLUB_ID}`)
	if (!res.ok) throw new Error(`NBB API responded with ${res.status}`)
	const data = (await res.json()) as { wedstrijden: ApiMatch[] }
	const now = new Date()
	const format = dateFormat(locale)
	return data.wedstrijden.map((m) => toMatch(m, now, format)).sort((a, b) => a.date.localeCompare(b.date))
}

/** Played matches, newest first. */
export async function fetchResults(limit?: number, locale?: string): Promise<Match[]> {
	const results = (await fetchMatches(locale)).filter((m) => m.played).reverse()
	return limit ? results.slice(0, limit) : results
}

/** Upcoming (not yet played) matches, soonest first. */
export async function fetchSchedule(limit?: number): Promise<Match[]> {
	const schedule = (await fetchMatches()).filter((m) => !m.played)
	return limit ? schedule.slice(0, limit) : schedule
}

/**
 * Shortens a team name to at most `max` characters. The trailing team number
 * (e.g. "MSE 1") is kept, the club part gets an ellipsis:
 * "BC Utrecht Cangeroes MSE 1" -> "BC Utrecht Cang… MSE 1"
 */
export function shortenName(name: string, max = 24): string {
	if (name.length <= max) return name
	const suffix = name.match(/\s+[A-Z]{1,4}\s*\d+$/)?.[0] ?? ""
	const base = name.slice(0, name.length - suffix.length)
	const room = max - suffix.length - 1
	if (room < 4) return name.slice(0, max - 1).trimEnd() + "…"
	return base.slice(0, room).replace(/[\s\-–.,]+$/, "") + "…" + suffix
}
