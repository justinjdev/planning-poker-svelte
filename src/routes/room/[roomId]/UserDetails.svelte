<script lang="ts">
	import EDiv from '$lib/components/EDiv.svelte';
	import type { Participant } from '$lib/interfaces';
	import { user } from '$lib/stores/user';

	export let participant: Participant;
	export let voting: boolean = false;
	export let callback: (p: Partial<Participant>) => void = () => {};

	const dispMap: Map<string, string> = new Map();

	dispMap.set('-1', '<i class="fa-solid fa-x" />');
	dispMap.set('0', '<i class="fa-solid fa-question" />');

	const getOrDef = (key: string) => {
		return dispMap.get(key) || key;
	};
</script>

<div
	class="card p-4 border-[1.5px]
            m-1 w-64 h-32 overflow-hidden border-[{participant.color}] bg-[{participant.color}]"
	class:border-dotted={participant.abstaining}
>
	{#if $user.id == participant.id}
		<EDiv
			value={participant.name}
			handleSubmit={(v) => callback({ id: participant.id, name: v })}
			dispStyle="card-header h3 text-center align-top h-14 overflow-y-auto"
			editStyle="input text-center align-top"
		/>
	{:else}
		<header class="card-header h3 text-center align-top h-14">
			{participant.name}
		</header>
	{/if}

	<section class="p-4 text-center h-16">
		{#if participant.abstaining}
			<i class="fa-solid fa-user-xmark" />
		{:else if voting}
			<i class="fa-solid fa-bolt-lightning animate-bounce" />
		{:else}
			{@html getOrDef(participant.vote.toString())}
		{/if}
	</section>
</div>
