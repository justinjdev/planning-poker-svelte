<script lang="ts">
	import type { Participant } from '$lib/interfaces';

	export let userProfile: Participant;
</script>

<div class="grid grid-cols-[auto_1fr] gap-2">
	<h2 class="text-center">Howdy, {userProfile.name}!</h2>
	<br />
	<form>
		<label class="label">
			<span>Name:</span>
			<input class="input" type="text" bind:value={userProfile.name} />
		</label>
		<label class="label">
			<span>Color:</span>
			<span class="flex items-center">
				<input class="input m-1 w-1/5" type="color" bind:value={userProfile.color} />
				<input class="input m-1 w-4/5" type="text" bind:value={userProfile.color} tabindex="-1" />
			</span>
		</label>
		<button type="button" class="btn variant-filled my-1 content-center"
			><i class="fa-solid fa-satellite-dish" />
			<span>Save!</span></button
		>
	</form>
</div>

<style>
</style>
