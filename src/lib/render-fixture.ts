import { initials, shortenName, type Match } from "./matches"

const $ = (el: ParentNode, selector: string) => el.querySelector<HTMLElement>(selector)!

/**
 * Fills a clone of a `<template>` that contains a server-rendered `FixtureRow` (blank match)
 * with the data of an upcoming match. Relies on the `data-*` hooks in FixtureRow.
 */
export function renderFixture(template: HTMLTemplateElement, match: Match) {
	const item = template.content.firstElementChild!.cloneNode(true) as HTMLElement
	$(item, "[data-date]").textContent = match.dateLabel
	$(item, "[data-time]").textContent = match.time
	$(item, "[data-venue]").textContent = match.venue
	const teams = [
		{ name: match.home, isUs: match.homeIsUs },
		{ name: match.away, isUs: match.awayIsUs },
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
	})
	return item
}
