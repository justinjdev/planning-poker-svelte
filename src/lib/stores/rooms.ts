import type { Room } from '$lib/interfaces';
import { writable } from 'svelte/store';

function roomStore() {
	const unsubscribe = () => {};
	const { subscribe, set, update } = writable<{ [key: string]: Room }>({});

	return {
		subscribe,
		set,
		update,
		unsubscribe
	};
}

export const rooms = roomStore();
