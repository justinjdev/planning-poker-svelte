<script lang="ts">
	import EDiv from '$lib/components/EDiv.svelte';
	import type { Participant } from '$lib/interfaces';
	import type { StateStore } from '$lib/stores/state';
	import { type UserMap, user } from '$lib/stores/user';

	export let userId: string;
	export let userMap: UserMap;
	export let roomState: StateStore;
	export let callback: (p: Partial<Participant>) => void = () => {};

	const dispMap: Map<string, string> = new Map();

	dispMap.set('-1', '<i class="fa-solid fa-x" />');
	dispMap.set('0', '<i class="fa-solid fa-question" />');

	const getOrDef = (key: string) => {
		return dispMap.get(key) || key;
	};

	console.log('card', userId, $userMap, $roomState);
</script>

{#if $userMap.get(userId)}
	<div
		class="card p-4 border-[1.5px] border-[{$userMap.get(userId).color}] m-1 w-64 h-32"
		class:border-dotted={$userMap.get(userId).abstaining}
	>
		{#if $user.id == userId}
			<EDiv
				value={$user.name}
				handleSubmit={(v) => callback({ id: $user.id, name: v })}
				dispStyle="card-header h3 text-center align-top"
				editStyle="input text-center align-top"
			/>
		{:else}
			<header class="card-header h3 text-center align-top">
				{$userMap.get(userId).name}
			</header>
		{/if}

		<section class="p-4 text-center">
			{#if $userMap.get(userId).abstaining}
				<i class="fa-solid fa-user-xmark" />
			{:else if $roomState.voting}
				<i class="fa-solid fa-bolt-lightning animate-bounce" />
			{:else}
				{@html getOrDef($userMap.get(userId).vote.toString())}
			{/if}
		</section>
	</div>
{/if}

<style>
	.spinner {
		animation: spin 1s linear infinite;
	}
</style>
