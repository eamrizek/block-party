import type { PageServerLoad, Actions } from './$types';
import { getCategories, createSignup, createRsvp } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const categories = getCategories();
	return { categories };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		// Honeypot check
		if (data.get('website')) {
			return fail(400, { error: 'Bot detected.' });
		}

		const name = (data.get('name') as string)?.trim();
		const contact_info = (data.get('contact_info') as string)?.trim() || null;
		const guest_count = parseInt(data.get('guest_count') as string);
		const category_ids = data.getAll('category_id').map((v) => parseInt(v as string)).filter((v) => !isNaN(v));
		const notes = (data.get('notes') as string)?.trim() || null;

		if (!name || name.length < 2) {
			return fail(400, { error: 'Please enter your name.' });
		}

		if (name.length > 100) {
			return fail(400, { error: 'Name is too long.' });
		}

		if (contact_info && contact_info.length > 200) {
			return fail(400, { error: 'Contact info is too long.' });
		}

		if (isNaN(guest_count) || guest_count < 1 || guest_count > 50) {
			return fail(400, { error: 'Please enter a valid party size (1–50).' });
		}

		// Always record the RSVP
		createRsvp(name, contact_info, guest_count, notes);

		// Optionally create potluck signups
		for (const category_id of category_ids) {
			try {
				createSignup(name, contact_info, category_id, notes);
			} catch (e: unknown) {
				const msg = e instanceof Error ? e.message : 'Unknown error';
				if (msg === 'Category is full') {
					return fail(400, { error: 'Sorry, one of the selected categories is already full. Please adjust your selections.' });
				}
				if (msg === 'Category not found') {
					return fail(400, { error: 'Invalid category selected.' });
				}
				return fail(500, { error: 'Something went wrong. Please try again.' });
			}
		}

		redirect(303, `/signup/confirmation?name=${encodeURIComponent(name)}`);
	}
};
