import { redirect } from '@sveltejs/kit';

// https://supabase.com/docs/guides/auth/auth-helpers/sveltekit
export const GET = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');

	if (code) {
		await supabase.auth.exchangeCodeForSession(code);
	}

	throw redirect(303, '/');
};
