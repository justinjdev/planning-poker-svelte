<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-modern.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';

	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import Footer from '$lib/components/Footer.svelte';

	import { Modal } from '@skeletonlabs/skeleton';
</script>

<Modal />
<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<h1 class="h1 text-center justify-center w-screen uppercase flex">Planning Poker</h1>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- <svelte:fragment slot="sidebarLeft">Sidebar Left</svelte:fragment> -->

	<div class="page-slot w-screen flex justify-center content-center">
		<slot />
	</div>

	<!-- ---- footer ---- -->
	<svelte:fragment slot="pageFooter"><Footer /></svelte:fragment>
</AppShell>

<style>
</style>
