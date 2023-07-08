<script lang="ts">
	let colorValue = '#000000';
	let name = '';
	let abstaining = false;
</script>

<div class="grid grid-cols-[auto_1fr] gap-2">
	<input class="input" type="color" bind:value={colorValue} />
	<input class="input" type="text" bind:value={colorValue} readonly tabindex="-1" />
</div>

<style>
</style>
