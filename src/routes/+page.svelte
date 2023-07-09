<script lang="ts">
	import { goto } from '$app/navigation';
	import { rooms } from '$lib/stores/rooms';
	import { user } from '$lib/stores/user';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	let tabSet: number = 0;
	let roomName: string = '';

	const handleSubmit = () => {
		if (rooms.hasRoom(roomName)) {
			goto(`/room/${roomName}`);
		}
	};

	const handleEntry = (e: Event) => {
		roomName = e.target.value;
	};

	const signInAnonymously = async () => {
		await supabase.auth.signInAnonymously();
	};

	// check if need to anon signin
	if (!$user) {
		supabase.auth.signInAnonymously();
	} else {
		console.log('User is logged in as ' + $user.name);
	}
</script>

<TabGroup class="w-80 my-10 py-2 px-5 border rounded">
	<Tab bind:group={tabSet} name="createTab" value={0}>
		<span>Create</span>
	</Tab>
	<Tab bind:group={tabSet} name="joinTab" value={1}>Join</Tab>
	<Tab bind:group={tabSet} name="demoTab" value={2}>Demo</Tab>

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
