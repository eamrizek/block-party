import { redirect } from '@sveltejs/kit';
import { isAuthenticated } from '$lib/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (isAuthenticated(event)) {
		redirect(302, '/admin/dashboard');
	}
	redirect(302, '/admin/login');
};
