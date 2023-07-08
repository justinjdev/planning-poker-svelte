<script lant="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	let tabSet = 0;
</script>

<TabGroup class="w-80 my-10 py-2 px-5 border rounded">
	<Tab bind:group={tabSet} name="createTab" value={0}>
		<span>Create</span>
	</Tab>
	<Tab bind:group={tabSet} name="joinTab" value={1}>Join</Tab>

	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		<label class="label">
			<span>Room Name:</span>
			<input class="input" type="text" placeholder="Room Name" />
		</label>
		<button type="button" class="btn variant-filled my-1">
			<i class="fa-solid fa-rocket" />
			<span>Go!</span>
		</button>
	</svelte:fragment>
</TabGroup>
