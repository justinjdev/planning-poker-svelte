import type { Participant } from '$lib/interfaces';
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

function userStore(startWith: Participant) {
	const unsubscribe = () => {};

	const { subscribe, set, update }: Writable<Participant> = localStorageStore(
		'userStore',
		startWith
	);

	const initUser = (uuid: string) => {
		const newUser = {
			id: uuid,
			name: `user#${uuid}`,
			color: '#3f3f3f',
			abstaining: false
		} as Participant;

		set(newUser);
	};

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
