// Refreshes src/data/club-logos.json from the NBB clubs feed. Run locally with `npm run update:club-logos`:
// the feed is behind Cloudflare, which blocks CI runners, so the build falls back to this snapshot.
import { writeFile } from "node:fs/promises"

const res = await fetch("https://api.basketballstats.nl/db/json/club.pl")
if (!res.ok) throw new Error(`NBB API responded with ${res.status}`)
const { clubs } = await res.json()
const logos = Object.fromEntries(clubs.filter((club) => club.logo).map((club) => [club.id, club.logo]).sort(([a], [b]) => a - b))
await writeFile(new URL("../src/data/club-logos.json", import.meta.url), JSON.stringify(logos, null, "\t") + "\n")
console.log(`Saved ${Object.keys(logos).length} club logos`)
