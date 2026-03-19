import type { PageServerLoad } from './$types';
import { getSignups, getCategories } from '$lib/db';

export const load: PageServerLoad = async () => {
	const signups = getSignups();
	const categories = getCategories();
	return { signups, categories };
};
