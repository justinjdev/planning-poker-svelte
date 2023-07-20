<script lang="ts">
	import type { StateStore } from '$lib/stores/state';
	import type { UserMap } from '$lib/stores/user';

	export let userId: string;
	export let userMap: UserMap;
	export let roomState: StateStore;

	const dispMap: Map<string, string> = new Map();

	dispMap.set('-1', '<i class="fa-solid fa-x" />');
	dispMap.set('0', '<i class="fa-solid fa-question" />');

	const getOrDef = (key: string) => {
		return dispMap.get(key) || key;
	};

	$: thisUser = $userMap.get(userId);
</script>

{#if thisUser}
	<div
		class="card p-4 border-[1.5px] border-[{thisUser.color}] m-1"
		class:border-dotted={thisUser.abstaining}
	>
		<slot />
		<section class="p-4 text-center">
			{#if thisUser.abstaining}
				<i class="fa-solid fa-user-xmark" />
			{:else if $roomState.voting}
				<i class="fa-solid fa-bolt-lightning animate-bounce" />
			{:else}
				{@html getOrDef(thisUser.vote.toString())}
			{/if}
		</section>
	</div>
{/if}

<style>
	.spinner {
		animation: spin 1s linear infinite;
	}
</style>
