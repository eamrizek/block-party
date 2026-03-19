import type { PageServerLoad, Actions } from './$types';
import { getCategories, createCategory, updateCategory, deleteCategory } from '$lib/db';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const categories = getCategories();
	return { categories };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const max_slots = parseInt(data.get('max_slots') as string);
		const description = (data.get('description') as string)?.trim() || null;

		if (!name || name.length < 1) return fail(400, { error: 'Name is required.' });
		if (isNaN(max_slots) || max_slots < 1) return fail(400, { error: 'Max slots must be at least 1.' });
		if (max_slots > 100) return fail(400, { error: 'Max slots cannot exceed 100.' });

		createCategory(name, max_slots, description);
		return { success: 'Category created.' };
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const name = (data.get('name') as string)?.trim();
		const max_slots = parseInt(data.get('max_slots') as string);
		const description = (data.get('description') as string)?.trim() || null;

		if (isNaN(id)) return fail(400, { error: 'Invalid ID.' });
		if (!name || name.length < 1) return fail(400, { error: 'Name is required.' });
		if (isNaN(max_slots) || max_slots < 1) return fail(400, { error: 'Max slots must be at least 1.' });
		if (max_slots > 100) return fail(400, { error: 'Max slots cannot exceed 100.' });

		updateCategory(id, name, max_slots, description);
		return { success: 'Category updated.' };
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (isNaN(id)) return fail(400, { error: 'Invalid ID.' });

		try {
			deleteCategory(id);
		} catch {
			return fail(400, { error: 'Cannot delete — this category may have sign-ups attached.' });
		}

		return { success: 'Category deleted.' };
	}
};
