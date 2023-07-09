import type { Room, RoomMap } from '$lib/interfaces';
import { get, writable } from 'svelte/store';

function roomStore(startWith: RoomMap = {}) {
	const unsubscribe = () => {};
	const { subscribe, set, update } = writable<RoomMap>(startWith, (set) => {
		set(startWith);
	});

	const reset = (pageId: string) => {
		rooms.update((r) => {
			for (const key in r[pageId].votes) {
				r[pageId].votes[key] = 0;
			}

			r[pageId].score = -1;

			return r;
		});
	};

	const calculateScore = (pageId: string) => {
		rooms.update((r) => {
			const tallyingScores = Object.values(r[pageId].votes).filter((v) => v > 0);

			let voteAvg =
				tallyingScores.reduce((sum, current) => sum + current, 0) / tallyingScores.length;

			r[pageId].score = voteAvg;

			return r;
		});
	};

	const hasRoom = (pageId: string) => {
		return get(rooms).hasOwnProperty(pageId);
	};

	return {
		subscribe,
		set,
		update,
		reset,
		calculateScore,
		hasRoom
	};
}

export const rooms = roomStore({
	test: {
		id: 'test',
		name: 'Test Room',
		admin: 'testu1',
		score: -1,
		voting: false,
		participants: [
			{
				id: 'testu1',
				name: 'Test User',
				color: '#3f3f3f',
				abstaining: false
			},
			{
				id: 'testu2',
				name: 'Test User 2',
				color: '#000000',
				abstaining: true
			},
			{
				id: 'testu3',
				name: 'Test User 3',
				color: '#3f7a5e',
				abstaining: false
			}
		],
		votes: {
			testu1: 5,
			testu2: 8,
			testu3: 0
		}
	}
});
