import type { RequestEvent } from '@sveltejs/kit';

const COOKIE_NAME = 'admin_session';
const COOKIE_VALUE = 'authenticated';

export function isAuthenticated(event: RequestEvent): boolean {
	return event.cookies.get(COOKIE_NAME) === COOKIE_VALUE;
}

export function setAuthCookie(event: RequestEvent) {
	event.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 8 // 8 hours
	});
}

export function clearAuthCookie(event: RequestEvent) {
	event.cookies.delete(COOKIE_NAME, { path: '/' });
}

export function checkAdminPassword(password: string): boolean {
	const adminPassword = process.env.ADMIN_PASSWORD;
	if (!adminPassword) {
		console.error('ADMIN_PASSWORD env var not set');
		return false;
	}
	return password === adminPassword;
}
