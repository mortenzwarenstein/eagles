import { initials, OUTCOME_CLASSES, shortenName, type Match } from "./matches"

const allOutcomeClasses = Object.values(OUTCOME_CLASSES).flatMap((c) => c.split(" "))
const $ = (el: ParentNode, selector: string) => el.querySelector<HTMLElement>(selector)!

/**
 * Fills a clone of a `<template>` that contains a server-rendered `ResultCard` (blank match)
 * with the data of a played match. Relies on the `data-*` hooks in ResultCard.
 */
export function renderResult(template: HTMLTemplateElement, outcomeLabels: Record<string, string>, match: Match) {
	const item = template.content.firstElementChild!.cloneNode(true) as HTMLElement
	$(item, "[data-date]").textContent = match.dateLabel
	const teams = [
		{ name: match.home, score: match.homeScore, isUs: match.homeIsUs },
		{ name: match.away, score: match.awayScore, isUs: match.awayIsUs },
	]
	item.querySelectorAll<HTMLElement>("[data-team]").forEach((row, i) => {
		const team = teams[i]
		$(row, "[data-logo]").hidden = !team.isUs
		const badge = $(row, "[data-initials]")
		badge.hidden = team.isUs
		badge.textContent = initials(team.name)
		const name = $(row, "[data-name]")
		name.textContent = shortenName(team.name)
		name.title = team.name
		name.classList.toggle("text-white/75", !team.isUs)
		const score = $(row, "[data-score]")
		score.textContent = String(team.score)
		score.classList.toggle("text-white/65", !team.isUs)
	})
	const outcome = $(item, "[data-outcome]")
	outcome.classList.remove(...allOutcomeClasses)
	outcome.classList.add(...OUTCOME_CLASSES[match.outcome!].split(" "))
	outcome.textContent = outcomeLabels[match.outcome!]
	return item
}
