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
	dispMap.set('13', '<i class="fa-solid fa-1"></i><i class="fa-solid fa-3"></i>');
	dispMap.set(
		'1000',
		'<i class="fa-solid fa-1"></i><i class="fa-solid fa-0"></i></i><i class="fa-solid fa-0"></i></i><i class="fa-solid fa-0"></i>'
	);

	const numIcon = '<i class="fa-solid fa-?"></i>';

	const getOrDef = (key: string) => {
		return dispMap.get(key) || numIcon.replace('?', key);
	};
</script>

<div
	class="card p-4 border-[1.5px]
            m-1 w-64 h-40 overflow-hidden border-[var(--border-color)] relative"
	class:border-dotted={participant.abstaining}
	style="--border-color: {participant.color}"
>
	{#if $user.id == participant.id}
		<EDiv
			value={participant.name}
			handleSubmit={(v) => callback({ id: participant.id, name: v })}
			dispStyle="card-header h3 text-center align-top h-14 overflow-y-auto"
			editStyle="input text-center align-top mt-5"
		/>
	{:else}
		<header class="card-header h3 text-center align-top h-14">
			{participant.name}
		</header>
	{/if}

	<section class="p-4 text-center h-16 absolute inset-x-0 bottom-0">
		{#if participant.abstaining}
			<i class="fa-solid fa-user-xmark" />
		{:else if voting}
			<i class="fa-solid fa-bolt-lightning animate-bounce" />
		{:else}
			{@html getOrDef(participant.vote.toString())}
		{/if}
	</section>
</div>

<style>
</style>
