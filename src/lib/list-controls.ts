/** Client-side controls shared by the paginated, team-filterable match lists (results and schedule). */

/**
 * Accessible custom dropdown (button + listbox) inside `root`, which needs the
 * `data-select-button`, `data-select-label` and `data-select-list` hooks.
 * Calls `onChange` with the chosen value.
 */
export function createSelect(
	root: ParentNode,
	options: { value: string; label: string }[],
	initial: string,
	onChange: (value: string) => void,
) {
	const selectButton = root.querySelector<HTMLButtonElement>("[data-select-button]")!
	const selectLabel = root.querySelector<HTMLElement>("[data-select-label]")!
	const selectList = root.querySelector<HTMLElement>("[data-select-list]")!

	let selected = Math.max(0, options.findIndex((o) => o.value === initial))
	let active = selected

	const items = options.map((option, i) => {
		const li = document.createElement("li")
		li.id = `team-option-${i}`
		li.setAttribute("role", "option")
		li.textContent = option.label
		li.className = "cursor-pointer px-4 py-3 text-sm font-semibold text-white/80 aria-selected:text-gold data-active:bg-white/10 data-active:text-white"
		li.addEventListener("click", () => choose(i))
		li.addEventListener("mousemove", () => setActive(i))
		return li
	})
	selectList.replaceChildren(...items)

	function sync() {
		selectLabel.textContent = options[selected].label
		items.forEach((li, i) => li.setAttribute("aria-selected", String(i === selected)))
	}
	function setActive(i: number) {
		active = Math.min(Math.max(0, i), items.length - 1)
		items.forEach((li, j) => li.toggleAttribute("data-active", j === active))
		selectList.setAttribute("aria-activedescendant", items[active].id)
		items[active].scrollIntoView({ block: "nearest" })
	}
	function open() {
		selectList.hidden = false
		selectButton.setAttribute("aria-expanded", "true")
		selectList.focus()
		setActive(selected)
	}
	function close(refocus = true) {
		selectList.hidden = true
		selectButton.setAttribute("aria-expanded", "false")
		if (refocus) selectButton.focus()
	}
	function choose(i: number) {
		const changed = i !== selected
		selected = i
		sync()
		close()
		if (changed) onChange(options[i].value)
	}

	selectButton.addEventListener("click", () => (selectList.hidden ? open() : close()))
	selectButton.addEventListener("keydown", (e) => {
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault()
			open()
		}
	})
	selectList.addEventListener("keydown", (e) => {
		const moves: Record<string, () => void> = {
			ArrowDown: () => setActive(active + 1),
			ArrowUp: () => setActive(active - 1),
			Home: () => setActive(0),
			End: () => setActive(items.length - 1),
			Enter: () => choose(active),
			" ": () => choose(active),
			Escape: () => close(),
		}
		if (e.key === "Tab") return close(false)
		if (moves[e.key]) {
			e.preventDefault()
			moves[e.key]()
		}
	})
	document.addEventListener("click", (e) => {
		if (!selectList.hidden && !(e.target as Element).closest("[data-select]")) close(false)
	})
	selectList.addEventListener("blur", () => setTimeout(() => !selectList.matches(":focus") && !selectList.hidden && close(false), 100))
	sync()
}

export interface PaginationLabels {
	label: string
	prev: string
	next: string
	page: string
}

const buttonClass =
	"flex size-11 items-center justify-center border border-white/25 text-sm font-bold text-white transition hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-30 aria-[current=page]:border-gold aria-[current=page]:bg-gold aria-[current=page]:text-navy"

function pageButton(label: string, text: string, onClick: () => void, disabled = false, current = false) {
	const button = document.createElement("button")
	button.type = "button"
	button.className = buttonClass
	button.textContent = text
	button.setAttribute("aria-label", label)
	button.disabled = disabled
	if (current) button.setAttribute("aria-current", "page")
	button.addEventListener("click", onClick)
	return button
}

/** Fills `nav` with prev / numbered / next buttons; hidden when there is only one page. */
export function renderPagination(nav: HTMLElement, labels: PaginationLabels, page: number, pages: number, goTo: (page: number) => void) {
	nav.replaceChildren(
		pageButton(labels.prev, "←", () => goTo(page - 1), page === 1),
		...Array.from({ length: pages }, (_, i) => pageButton(`${labels.page} ${i + 1}`, String(i + 1), () => goTo(i + 1), false, i + 1 === page)),
		pageButton(labels.next, "→", () => goTo(page + 1), page === pages),
	)
	nav.hidden = pages === 1
}

/** Mirrors the page and team into the query string (without adding history entries). */
export function syncUrl(page: number, team: string) {
	const url = new URL(location.href)
	if (page === 1) url.searchParams.delete("page")
	else url.searchParams.set("page", String(page))
	if (team) url.searchParams.set("team", team)
	else url.searchParams.delete("team")
	history.replaceState(null, "", url)
}
