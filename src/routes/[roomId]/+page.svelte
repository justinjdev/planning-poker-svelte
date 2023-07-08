<script lang="ts">
	import { page } from '$app/stores';
	import { rooms } from '$lib/stores/rooms';
	import { user } from '$lib/stores/user';
	import { ProgressBar } from '@skeletonlabs/skeleton';

	let pageId = $page.params.roomId;
	let options = [1, 2, 3, 5, 8, 13, 1000, '?'];

	rooms.update((r) => {
		if (!(pageId in r)) {
			console.log('adding');
			r[pageId] = {
				id: 'test',
				name: 'Test Room',
				admin: 'testu1',
				voting: true,
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
						abstaining: false
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
			};
		}
		return r;
	});

	$: thisRoom = $rooms[pageId];
</script>

<div class="room-wrapper">
	<h1 class="text-center">Welcome to {thisRoom.name}</h1>

	{#if thisRoom.admin === $user.id}
		<div class="admin-pane">
			<button class="btn variant-filled my-1" on:click={() => (thisRoom.voting = !thisRoom.voting)}>
				<span
					><i
						class="fa-solid"
						class:fa-play={!thisRoom.voting}
						class:fa-stop={thisRoom.voting}
					/></span
				>
				<span>{thisRoom.voting ? 'Stop' : 'Start'} Voting</span>
			</button>
		</div>
	{/if}

	<div class="results py-4 px-1">
		<ProgressBar
			label="Progress Bar"
			value={Object.values(thisRoom.votes).filter((v) => v > 0).length}
			max={thisRoom.participants.filter((p) => !p.abstaining).length}
		/>
	</div>

	<div class="participants flex justify-center items-center">
		{#if thisRoom}
			{#each thisRoom.participants as participant}
				<div class="card p-4 border-2 border-[{participant.color}] m-1">
					<header class="card-header h3 text-center align-top">{participant.name}</header>
					<section class="p-4 text-center">
						{thisRoom.voting ? '?' : thisRoom.votes[participant.id]}
					</section>
				</div>
			{/each}
		{/if}
	</div>
</div>
