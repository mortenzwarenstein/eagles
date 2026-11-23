import { getEntry } from "astro:content"
import { getRelativeLocaleUrl } from "astro:i18n"
import { ui } from "./ui"

export type Locale = keyof typeof ui
export const locales = Object.keys(ui) as Locale[]
export const defaultLocale: Locale = "nl"

export const isLocale = (value: unknown): value is Locale => typeof value === "string" && value in ui

/** Resolve the locale from `Astro.currentLocale`, falling back to the default. */
export const resolveLocale = (value: string | undefined): Locale => (isLocale(value) ? value : defaultLocale)

export function useTranslations(locale: Locale) {
	return (key: keyof (typeof ui)[typeof defaultLocale]) => ui[locale][key] ?? ui[defaultLocale][key]
}

/** Localised page content, falling back to the default locale when a translation is missing. */
export async function getHomeContent(locale: Locale) {
	const entry = (await getEntry("home", locale)) ?? (await getEntry("home", defaultLocale))
	if (!entry) throw new Error(`Missing home content for "${locale}"`)
	return entry.data
}

/** The same page in another locale, e.g. "/en/roosters" -> "/roosters" for "nl". */
export function localizedPathname(pathname: string, target: Locale) {
	const [, first, ...rest] = pathname.split("/")
	const unprefixed = isLocale(first) ? rest.join("/") : pathname.slice(1)
	return getRelativeLocaleUrl(target, unprefixed)
}
