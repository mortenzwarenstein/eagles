/** Small DOM helpers for the client-side renderers. */

/** `querySelector` for hooks that are known to exist. */
export const $ = <T extends Element = HTMLElement>(el: ParentNode, selector: string) => el.querySelector<T>(selector)!

/** A fresh copy of a `<template>`'s first element. */
export const cloneTemplate = (template: HTMLTemplateElement) => template.content.firstElementChild!.cloneNode(true) as HTMLElement

/** Parses a JSON `data-*` attribute. */
export const readJson = <T>(el: HTMLElement, key: string): T => JSON.parse(el.dataset[key]!)

/** Swaps the skeletons in `container` for `items`, or for a visible `emptyMessage` in `status` when there are none. */
export function showItems(container: HTMLElement, status: HTMLElement, items: HTMLElement[], emptyMessage: string) {
	container.replaceChildren(...items)
	container.hidden = items.length === 0
	status.textContent = items.length === 0 ? emptyMessage : ""
	status.classList.toggle("sr-only", items.length > 0)
}
