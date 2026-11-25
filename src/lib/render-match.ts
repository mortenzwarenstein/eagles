import type { ClubLogos } from "./clubs"
import { $, cloneTemplate } from "./dom"
import { initials, OUTCOME_CLASSES, shortenName, type Match } from "./matches"

const allOutcomeClasses = Object.values(OUTCOME_CLASSES).flatMap((c) => c.split(" "))

interface Team {
	name: string
	isUs: boolean
	logo?: string
	score?: number
}

const teamsOf = (match: Match, logos: ClubLogos): [Team, Team] => [
	{ name: match.home, isUs: match.homeIsUs, logo: logos[match.homeClubId], score: match.homeScore },
	{ name: match.away, isUs: match.awayIsUs, logo: logos[match.awayClubId], score: match.awayScore },
]

/** Fills one `[data-team]` row (see TeamBadge): our logo, the opponent's club logo, or their initials as fallback. */
function fillTeam(row: HTMLElement, team: Team) {
	const ownLogo = $(row, "[data-logo]")
	const clubLogo = $<HTMLImageElement>(row, "[data-club-logo]")
	const badge = $(row, "[data-initials]")
	const showClubLogo = !team.isUs && Boolean(team.logo)

	ownLogo.hidden = !team.isUs
	clubLogo.hidden = !showClubLogo
	badge.hidden = team.isUs || showClubLogo
	badge.textContent = initials(team.name)
	if (showClubLogo) {
		clubLogo.addEventListener("error", () => {
			clubLogo.hidden = true
			badge.hidden = false
		}, { once: true })
		clubLogo.src = team.logo!
	}

	const name = $(row, "[data-name]")
	name.textContent = shortenName(team.name)
	name.title = team.name
	name.classList.toggle("text-white/75", !team.isUs)

	const score = row.querySelector<HTMLElement>("[data-score]")
	if (score) {
		score.textContent = String(team.score)
		score.classList.toggle("text-white/65", !team.isUs)
	}
}

function fillTeams(item: HTMLElement, match: Match, logos: ClubLogos) {
	const teams = teamsOf(match, logos)
	item.querySelectorAll<HTMLElement>("[data-team]").forEach((row, i) => fillTeam(row, teams[i]))
}

/** A played match, from a `<template>` holding a blank ResultCard or ResultRow. */
export function renderResult(template: HTMLTemplateElement, outcomeLabels: Record<string, string>, match: Match, logos: ClubLogos = {}) {
	const item = cloneTemplate(template)
	$(item, "[data-date]").textContent = match.dateLabel
	fillTeams(item, match, logos)
	const outcome = $(item, "[data-outcome]")
	outcome.classList.remove(...allOutcomeClasses)
	outcome.classList.add(...OUTCOME_CLASSES[match.outcome!].split(" "))
	outcome.textContent = outcomeLabels[match.outcome!]
	return item
}

/** An upcoming match, from a `<template>` holding a blank FixtureRow. */
export function renderFixture(template: HTMLTemplateElement, match: Match, logos: ClubLogos = {}) {
	const item = cloneTemplate(template)
	$(item, "[data-date]").textContent = match.dateLabel
	$(item, "[data-time]").textContent = match.time
	$(item, "[data-venue]").textContent = match.venue
	fillTeams(item, match, logos)
	return item
}
