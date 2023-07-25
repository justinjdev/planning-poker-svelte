import type { Participant } from '$lib/interfaces';
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

import { uuid } from '$lib/utils';
import { writable } from 'svelte/store';

const defaultUser: Participant = {
	id: '',
	name: '',
	color: '',
	abstaining: false,
	vote: 0
};

export function genUser(): Participant {
	const id = uuid();
	const newUser = {
		id: id,
		name: `User ${id.slice(0, 4)}`,
		color: '#' + Math.floor(Math.random() * 16777215).toString(16),
		abstaining: false,
		vote: 0
	};

	return newUser;
}

/**
 * a user store that leverages local storage to persist the user. intention is make the app 'usable'
 * without requiring auth for everyone.
 * @returns User store, initialized if necessary
 */
const userStore = () => {
	const unsubscribe = () => {};
	const { subscribe, update } = localStorageStore<Participant>('participant', defaultUser);

	// this seems a little buggy
	function init() {
		update((state) => {
			if (!state || state.id === defaultUser.id) {
				return genUser();
			} else {
				return state;
			}
		});
	}

	init();

	return { subscribe, update, unsubscribe };
};

export const user = userStore();
export type UserStore = ReturnType<typeof userStore>;

export const mapStore = <T>() => {
	const unsubscribe = () => {};

	const { subscribe, update } = writable<Map<string, T>>(new Map<string, T>());

	const add = (key: string, value: T) => {
		update((state) => {
			state.set(key, value);
			return state;
		});
	};

	const removeById = (id: string) => {
		update((state) => {
			state.delete(id);
			return state;
		});
	};

	const updateValue = (key: string, value: Partial<T>) => {
		update((state) => {
			const current = state.get(key);
			if (current) {
				state.set(key, { ...current, ...value });
			}
			return state;
		});
	};

	return {
		subscribe,
		add,
		updateValue,
		removeById,
		unsubscribe
	};
};

/**
 *
 * @returns a user store backed by a {@link Map}, handled as id: participant
 */
export const userMap = () => {
	const unsubscribe = () => {};

	const { subscribe, update } = writable<Map<string, Participant>>(new Map<string, Participant>());

	const addUser = (key: string, user: Participant) => {
		update((state) => {
			state.set(key, user);
			return state;
		});
	};

	const updateUser = (key: string, user: Partial<Participant>) => {
		update((state) => {
			const current = state.get(key);
			if (current) {
				state.set(key, { ...current, ...user });
			}
			return state;
		});
	};

	const removeUserById = (id: string) => {
		update((state) => {
			state.delete(id);
			return state;
		});
	};

	const clearAllButCurrent = (current: Participant) => {
		update((state) => {
			state.clear();
			if (current) {
				state.set(current.id, current);
			}
			return state;
		});
	};

	return {
		subscribe,
		addUser,
		clearAllButCurrent,
		updateUser,
		removeUserById,
		unsubscribe
	};
};

export type UserMap = ReturnType<typeof userMap>;
