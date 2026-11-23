/**
 * Membership registration, backed by the Foys public API (the same service that powers
 * https://www.utrechteagles.nl/eagles/Registration.html).
 */
const API_URL = "https://api.foys.io/foys/api/v2/pub"
const FORM_ID = "e89bb28c-a234-4923-9e40-08df16fcbea8"

/** Where the browser POSTs the registration (the API allows cross-origin requests). */
export const REGISTRATION_ENDPOINT = `${API_URL}/registration-forms/${FORM_ID}`

/** Id of the optional "Rugnummer" (jersey number) custom field of the form. */
export const JERSEY_NUMBER_FIELD_ID = 7550

export interface Plan {
	id: number
	name: string
	price: number
	/** Allowed age range (inclusive) */
	fromAge: number
	toAge: number
}

/** Plan codes that can't be chosen when signing up (e.g. "NSS" = non-playing staff member). */
const EXCLUDED_PLAN_CODES = ["NSS"]

interface ApiPlan extends Plan {
	planCode: string
	startDate: string
	endDate: string
}

/** Membership plans that are valid today. */
export async function fetchPlans(): Promise<Plan[]> {
	const today = new Date().toISOString().slice(0, 10)
	const res = await fetch(`${REGISTRATION_ENDPOINT}/plans?startDate=${today}`)
	if (!res.ok) throw new Error(`Foys API responded with ${res.status}`)
	const plans = (await res.json()) as ApiPlan[]
	return plans
		.filter((plan) => !EXCLUDED_PLAN_CODES.includes(plan.planCode))
		.map(({ id, name, price, fromAge, toAge }) => ({ id, name, price, fromAge, toAge }))
}

export const formatPrice = (price: number, bcp47: string) =>
	price === 0 ? "—" : new Intl.NumberFormat(bcp47, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price)
