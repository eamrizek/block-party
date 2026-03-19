import { redirect } from '@sveltejs/kit';
import { clearAuthCookie } from '$lib/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	clearAuthCookie(event);
	redirect(302, '/admin/login');
};
