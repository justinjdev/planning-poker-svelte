import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { user } from './stores/user';
import { get } from 'svelte/store';
import type { Participant } from './interfaces';

export const supabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const trackRoom = (supabaseClient: SupabaseClient, channelName: string): RealtimeChannel => {
	const roomChannel = supabaseClient.channel(channelName, {
		config: {
			presence: {
				key: get(user).id
			}
		}
	});

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
				// not sure if this part actually works
				const presenceTrackStatus = await roomChannel.track(get(user));
				console.log(presenceTrackStatus);
			}
		});

	return roomChannel;
};

const updateRoom = async (roomChannel: RealtimeChannel, update: Participant) => {
	roomChannel.subscribe(async (status) => {
		if (status === 'SUBSCRIBED') {
			const presenceTrackStatus = await roomChannel.track(update);
			console.log(presenceTrackStatus);
		}
	});
};
