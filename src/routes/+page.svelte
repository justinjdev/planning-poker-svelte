<script lang="ts">
	import { goto } from '$app/navigation';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	let tabSet: number = 0;
	let roomName: string = '';

	const handleSubmit = () => {
		goto(`/room/${roomName}`);
	};

	const handleEntry = (e: Event) => {
		roomName = e.target.value;
	};
</script>

<TabGroup class="w-80 my-10 py-2 px-5 border rounded">
	<Tab bind:group={tabSet} name="joinTab" value={0}>Join</Tab>
	<Tab bind:group={tabSet} name="demoTab" value={1}>Demo</Tab>

	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet < 2}
			<label class="label">
				<span>Room {tabSet === 0 ? 'Name' : 'ID'}:</span>
				<input
					class="input"
					type="text"
					placeholder="Room {tabSet === 0 ? 'Name' : 'ID'}"
					required
					on:change={handleEntry}
				/>
			</label>
			<button type="button" class="btn variant-filled my-1" on:click|preventDefault={handleSubmit}>
				<i class="fa-solid fa-rocket" />
				<span>Go!</span>
			</button>
		{:else}
			<button
				type="button"
				class="btn variant-filled my-1"
				on:click|preventDefault={() => goto('/room/test')}
			>
				<i class="fa-solid fa-vial" />
				<span>Demo time!</span>
			</button>
		{/if}
	</svelte:fragment>
</TabGroup>
