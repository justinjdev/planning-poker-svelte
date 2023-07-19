import type { LocalState, ManagedState, RoomState } from '$lib/interfaces';
import { writable } from 'svelte/store';

export const defaultState: ManagedState = {
	voting: false,
	name: 'Room Name',
	resetVote: false,
	tally: 0
};

export const stateStore = (startWith?: ManagedState) => {
	const unsubscribe = () => {};

	const { update, subscribe } = writable<ManagedState>(startWith || defaultState);

	const updateState = (state: Partial<ManagedState>) => {
		update((current) => {
			return { ...current, ...state };
		});
	};

	return {
		subscribe,
		updateState,
		unsubscribe
	};
};

export type StateStore = ReturnType<typeof stateStore>;
