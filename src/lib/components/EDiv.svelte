<script lang="ts">
	let editing: boolean = false;

	export let value: string;
	export let preEdit = value;

	export let dispStyle: string = '';
	export let editStyle: string = '';

	export let handleSubmit: (s: string) => void;

	function submit() {
		editing = false;
		handleSubmit(value);
	}

	function keydown(event: KeyboardEvent) {
		if (event.key == 'Escape') {
			event.preventDefault();
			value = preEdit;
			editing = false;
		}
	}

	function focus(element: HTMLElement) {
		element.focus();
	}
</script>

{#if editing}
	<form on:submit|preventDefault={submit} on:keydown={keydown} class="pt-5">
		<input bind:value required use:focus on:blur={submit} class={editStyle} />
	</form>
{:else}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<header on:click|preventDefault={() => (editing = true)} class={dispStyle}>
		{value}
	</header>
{/if}

<style>
</style>
