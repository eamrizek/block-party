import type { PageServerLoad } from './$types';
import { getSignups, getCategories, getRsvps } from '$lib/db';

export const load: PageServerLoad = async () => {
	const signups = getSignups();
	const categories = getCategories();
	const rsvps = getRsvps();
	return { signups, categories, rsvps };
};
