import type { Participant } from '$lib/interfaces';
import { writable } from 'svelte/store';

function userStore(startWith: Participant) {
	const unsubscribe = () => {};

	const { subscribe, set, update } = writable<Participant>(startWith, (set) => {
		set(startWith);

		// unsubscribe will be handled by the snapshot unsubscribe
		// return () => unsubscribe();
	});

	return {
		subscribe,
		set,
		update
	};
}

export const user = userStore({
	id: 'testu1',
	name: 'Test User',
	color: '#3f3f3f',
	abstaining: false
});
