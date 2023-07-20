import { writable } from 'svelte/store';

/**
 *
 * @param channel a realtime channel, subscribed to a topic
 * @param listenType the type of Realtime event to listen on
 * @param trackedEvent the event to track
 * @returns
 */
export function eventStore<T>() {
	const unsubscribe = () => {};

	const { subscribe, set, update } = writable<T[]>([]);

	const addEvent = (e: T) => {
		update((state) => {
			state.push(e);
			return state;
		});
	};

	return {
		subscribe,
		addEvent,
		unsubscribe
	};
}

export type EventStore<T> = ReturnType<typeof eventStore>;

/**
 *
 * @returns a store backed by a {@link Map}
 */
export function mapStore<T>() {
	const unsubscribe = () => {};

	const { subscribe, update } = writable<Map<string, T>>(new Map<string, T>());

	const setValue = (key: string, value: T) => {
		update((state) => {
			state.set(key, value);
			return state;
		});
	};

	return {
		subscribe,
		setValue,
		unsubscribe
	};
}
