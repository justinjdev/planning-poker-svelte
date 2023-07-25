<script lang="ts">
	import { page } from '$app/stores';
	import { RoomImpl } from '$lib/room';
	import type { StateStore } from '$lib/stores/state';
	import { user, type UserMap } from '$lib/stores/user';
	import { Modal, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';
	import UserDetails from './UserDetails.svelte';

	const roomId = $page.params.roomId;
	const testMode = $page.url.searchParams.get('test') === 'true';

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

	const toggleAbstain = () => {
		roomHandler.toggleAbstain();
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
	<Modal {modalSettings} />
	{#if roomHandler}
		<h1 class="text-center">Welcome to {$roomState.name}</h1>
		<!-- not handling admin toggles for now -->
		{#if testMode}
			<button
				type="button"
				class="btn text-center variant-filled"
				on:click|preventDefault={() => roomHandler.addRandomUser()}>Add user</button
			>
			<button
				type="button"
				class="btn text-center variant-filled"
				on:click={() => roomHandler.rolecall()}>Rolecall</button
			>
		{/if}
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
			<button class="btn variant-filled my-1" on:click={toggleAbstain}>
				<span
					><i
						class="fa-solid"
						class:fa-user-xmark={!$user.abstaining}
						class:fa-bolt-lightning={$user.abstaining}
					/></span
				>
				<span>{$user.abstaining ? 'Participate' : 'Watch'}</span>
			</button>
		</section>

		<div class="voting-pane" />

		<section class="voting-pane text-center">
			{#each options as option}
				<button
					class="btn btn-sm border-2 variant-filled my-1 mx-[0.5px]"
					on:click={() => handleVote(option)}
					class:border-green-400={$user.vote === parseInt(option)}
					disabled={!$roomState.voting || $user.abstaining}
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

		<section class="participants flex justify-center items-center w-100">
			<!-- local user, always first -->
			<UserDetails
				participant={$user}
				voting={$roomState.voting}
				callback={(p) => roomHandler.updateCurrentUser(p)}
			/>

			{#each [...$roomUsers] as [id, v] (id)}
				{#if id !== $user.id}
					<UserDetails participant={v} voting={$roomState.voting} />
				{/if}
			{/each}
		</section>
	{/if}
</div>
