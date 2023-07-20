<script lang="ts">
	import type { StateStore } from '$lib/stores/state';
	import { page } from '$app/stores';
	import { RoomImpl } from '$lib/room';
	import { user, type UserMap } from '$lib/stores/user';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';

	const roomId = $page.params.roomId;
	const options = ['1', '2', '3', '5', '8', '13', '1000', '0'] as const;

	let roomHandler: RoomImpl;
	let roomUsers: UserMap;
	let roomState: StateStore;

	const handleVote = (v: string) => {
		roomHandler.sendVote(parseInt(v));
	};

	const toggleVoting = () => {
		roomHandler.toggleVoting();
	};

	const modalSettings = (score: number): ModalSettings => {
		return {
			type: 'alert',
			title: 'Results',
			body: score + '',
			buttonTextCancel: 'Neat!'
		};
	};

	onMount(() => {
		roomHandler = new RoomImpl(roomId, $user);
		roomUsers = roomHandler.users();
		roomState = roomHandler.state();
	});

	onDestroy(() => {
		if (roomHandler) {
			roomHandler.leave();
		}
	});
</script>

<div class="room-wrapper">
	{#if roomHandler}
		<h1 class="text-center">Welcome to {$roomState.name}</h1>
		<!-- not handling admin toggles for now -->
		<section class="admin-pane text-center">
			<button class="btn variant-filled my-1" on:click={toggleVoting}>
				<span
					><i
						class="fa-solid"
						class:fa-play={!$roomState.voting}
						class:fa-stop={$roomState.voting}
					/></span
				>
				<span>{$roomState.voting ? 'Stop' : 'Start'} Voting</span>
			</button>
		</section>

		<div class="voting-pane" />

		<section class="voting-pane text-center">
			{#each options as option}
				<button
					class="btn btn-sm border-2 variant-filled my-1 mx-[0.5px]"
					on:click={() => handleVote(option)}
					class:border-green-400={$user.vote === parseInt(option)}
					disabled={!$roomState.voting}
				>
					<span>{option === '0' ? '?' : option}</span>
				</button>
			{/each}
		</section>

		<!-- this only really works if the votes are reset -->
		<!-- <section class="results py-4 px-1">
			<ProgressBar
				label="Progress Bar"
				value={[...$roomUsers].filter((_, v) => v.vote > 0).length}
				max={[...$roomUsers].filter((k, v) => !v.abstaining).length}
			/>
		</section> -->

		<section class="participants flex justify-center items-center">
			{#each [...$roomUsers] as [_, participant]}
				<div
					class="card p-4 border-[1.5px] border-[{participant.color}] m-1"
					class:border-dotted={participant.abstaining}
				>
					<header class="card-header h3 text-center align-top">{participant.name}</header>
					<section class="p-4 text-center">
						{#if participant.abstaining}
							<i class="fa-solid fa-user-xmark" />
						{:else if $roomState.voting}
							<i class="fa-solid fa-bolt-lightning animate-bounce" />
						{:else}
							{participant.vote === 0 ? '?' : participant.vote}
						{/if}
					</section>
				</div>
			{/each}
		</section>
	{/if}
</div>

<style>
	.spinner {
		animation: spin 1s linear infinite;
	}
</style>
