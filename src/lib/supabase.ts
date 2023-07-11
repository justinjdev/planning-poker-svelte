import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { user } from './stores/user';
import { get } from 'svelte/store';

export const supabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

const trackRoom = (supabaseClient: SupabaseClient, channelName: string) => {
	const roomChannel = supabaseClient.channel(channelName);

	roomChannel
		.on('presence', { event: 'sync' }, () => {
			const newState = roomChannel.presenceState();
			// update room state?
			console.log('sync', newState);
		})
		.on('presence', { event: 'join' }, ({ key, newPresences }) => {
			// update player state
			console.log('join', key, newPresences);
		})
		.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
			// update room state
			console.log('leave', key, leftPresences);
		})
		.subscribe(async (status) => {
			if (status === 'SUBSCRIBED') {
				const presenceTrackStatus = await roomChannel.track(get(user));
				console.log(presenceTrackStatus);
			}
		});
};
