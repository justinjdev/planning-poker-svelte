import type { Participant } from '$lib/interfaces';
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

function userStore(userId?: string, startWith?: Participant) {
	const unsubscribe = () => {};

	const initUser = (uuid: string | undefined) => {
		const newUser = {
			id: uuid,
			name: `user#${uuid}`,
			color: randomColor(),
			abstaining: false
		} as Participant;

		return newUser;
	};

	const { subscribe, set, update }: Writable<Participant> = localStorageStore(
		'userStore',
		initUser(userId || startWith?.id || crypto.randomUUID())
	);

	return {
		subscribe,
		update,
		unsubscribe
	};
}

const randomColor = (): string => {
	return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

export const user = userStore();
