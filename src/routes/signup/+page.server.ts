import type { PageServerLoad, Actions } from './$types';
import { getCategories, createSignup } from '$lib/db';
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
		const category_id = parseInt(data.get('category_id') as string);
		const notes = (data.get('notes') as string)?.trim() || null;

		if (!name || name.length < 2) {
			return fail(400, { error: 'Please enter your name.' });
		}

		if (!category_id || isNaN(category_id)) {
			return fail(400, { error: 'Please select an item to bring.' });
		}

		if (name.length > 100) {
			return fail(400, { error: 'Name is too long.' });
		}

		if (contact_info && contact_info.length > 200) {
			return fail(400, { error: 'Contact info is too long.' });
		}

		try {
			createSignup(name, contact_info, category_id, notes);
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : 'Unknown error';
			if (msg === 'Category is full') {
				return fail(400, { error: 'Sorry, that item category is already full. Please choose another.' });
			}
			if (msg === 'Category not found') {
				return fail(400, { error: 'Invalid category selected.' });
			}
			return fail(500, { error: 'Something went wrong. Please try again.' });
		}

		redirect(303, `/signup/confirmation?name=${encodeURIComponent(name)}`);
	}
};
