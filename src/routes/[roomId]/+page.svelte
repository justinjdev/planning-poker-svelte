<script lang="ts">
	import { page } from '$app/stores';
	import { rooms } from '$lib/stores/rooms';
	import { user } from '$lib/stores/user';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	let pageId = $page.params.roomId;
	let options = ['1', '2', '3', '5', '8', '13', '1000', '0'];
	let votescore: number = 0;

	const resetVotes = () => {
		rooms.reset(pageId);
	};

	const handleVote = (v: string) => {
		rooms.update((r) => {
			r[pageId].votes[$user.id] = parseInt(v);

			return r;
		});
	};

	const toggleVoting = () => {
		if (!thisRoom.voting) {
			resetVotes();
			thisRoom.voting = true;
		} else {
			thisRoom.voting = false;
			rooms.calculateScore(pageId);
			console.log($rooms[pageId].score);
			modalStore.trigger(modalSettings($rooms[pageId].score));
		}
	};

	const modalSettings = (score: number): ModalSettings => {
		return {
			type: 'alert',
			title: 'Voting Results!',
			body: score + ''
			// image: 'https://i.imgur.com/WOgTG96.gif'
		};
	};

	$: thisRoom = $rooms[pageId];
</script>

<div class="room-wrapper">
	<h1 class="text-center">Welcome to {thisRoom.name}</h1>

	{#if thisRoom.admin === $user.id}
		<section class="admin-pane text-center">
			<button class="btn variant-filled my-1" on:click={toggleVoting}>
				<span
					><i
						class="fa-solid"
						class:fa-play={!thisRoom.voting}
						class:fa-stop={thisRoom.voting}
					/></span
				>
				<span>{thisRoom.voting ? 'Stop' : 'Start'} Voting</span>
			</button>
			<button class="btn variant-filled my-1" on:click={resetVotes}>
				<span><i class="fa-solid" /></span>
				<span>Reset Voting</span>
			</button>
		</section>
	{/if}

	<div class="voting-pane" />

	<section class="voting-pane text-center">
		{#each options as option}
			<button
				class="btn btn-sm border-2 variant-filled my-1 mx-[0.5px]"
				on:click={() => handleVote(option)}
				class:border-green-400={thisRoom.votes[$user.id] === parseInt(option)}
				disabled={!thisRoom.voting}
			>
				<span>{option === '0' ? '?' : option}</span>
			</button>
		{/each}
	</section>

	<section class="results py-4 px-1">
		<ProgressBar
			label="Progress Bar"
			value={Object.values(thisRoom.votes).filter((v) => v > 0).length}
			max={thisRoom.participants.filter((p) => !p.abstaining).length}
		/>
	</section>

	<section class="participants flex justify-center items-center">
		{#if thisRoom}
			{#each thisRoom.participants as participant}
				<div
					class="card p-4 border-[1.5px] border-[{participant.color}] m-1"
					class:border-dotted={participant.abstaining}
				>
					<header class="card-header h3 text-center align-top">{participant.name}</header>
					<section class="p-4 text-center">
						{#if participant.abstaining}
							<i class="fa-solid fa-user-xmark" />
						{:else if thisRoom.voting}
							<i class="fa-solid fa-bolt-lightning animate-bounce" />
						{:else}
							{thisRoom.votes[participant.id] === 0 ? '?' : thisRoom.votes[participant.id]}
						{/if}
					</section>
				</div>
			{/each}
		{/if}
	</section>
</div>

<style>
	.spinner {
		animation: spin 1s linear infinite;
	}
</style>
