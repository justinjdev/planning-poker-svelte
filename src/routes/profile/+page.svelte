<script lang="ts">
	import UserProfile from '$lib/components/UserProfile.svelte';
	import type { Participant } from '$lib/interfaces';
	import { user } from '$lib/stores/user';

	let userProfile: Participant = $user;
</script>

<UserProfile {userProfile} />
