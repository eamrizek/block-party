import { redirect } from '@sveltejs/kit';
import { isAuthenticated } from '$lib/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// Allow the login page through
	if (event.url.pathname === '/admin/login') return {};

	if (!isAuthenticated(event)) {
		redirect(302, '/admin/login');
	}

	return {};
};
