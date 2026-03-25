import { fail } from '@sveltejs/kit';
import { getComments, createComment } from '$lib/db';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return { comments: getComments() };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		// Honeypot
		if (data.get('website')) return fail(400, { error: 'Invalid submission.' });

		const name = (data.get('name') as string)?.trim();
		const message = (data.get('message') as string)?.trim();

		if (!name || name.length > 100) return fail(400, { error: 'Please enter your name (max 100 characters).' });
		if (!message || message.length > 1000) return fail(400, { error: 'Please enter a message (max 1000 characters).' });

		createComment(name, message);

		return { success: true };
	}
};
