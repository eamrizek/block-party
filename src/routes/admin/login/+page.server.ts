import type { PageServerLoad, Actions } from './$types';
import { isAuthenticated, checkAdminPassword, setAuthCookie } from '$lib/auth';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	if (isAuthenticated(event)) {
		redirect(302, '/admin/dashboard');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const password = data.get('password') as string;

		if (!checkAdminPassword(password)) {
			return fail(401, { error: 'Incorrect password.' });
		}

		setAuthCookie(event);
		redirect(303, '/admin/dashboard');
	}
};
