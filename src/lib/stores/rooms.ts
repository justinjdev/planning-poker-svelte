import type { Room } from '$lib/interfaces';
import { writable } from 'svelte/store';

function roomStore() {
	const unsubscribe = () => {};
	const { subscribe, set, update } = writable<{ [key: string]: Room }>({});

	const reset = (pageId: string) => {
		rooms.update((r) => {
			for (const key in r[pageId].votes) {
				r[pageId].votes[key] = 0;
			}

			return r;
		});
	};

	return {
		subscribe,
		set,
		update,
		reset
	};
}

export const rooms = roomStore();
