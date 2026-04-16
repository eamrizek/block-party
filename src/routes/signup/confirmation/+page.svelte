<script lang="ts">
	import { page } from '$app/stores';
	import Nav from '$lib/Nav.svelte';
	const name = $page.url.searchParams.get('name') || 'Neighbor';
</script>

<svelte:head>
	<title>Thanks! – Block Party</title>
</svelte:head>

<Nav />

<main class="container">
	<div class="confirmation">
		<div class="icon">🎊</div>
		<h1>You're RSVPed, {name}!</h1>
		<p>Thanks for letting us know you'll be there. We can't wait to see you at the block party!</p>
		<p class="muted">
			Saturday, June 20, 2026 · 3:00 PM – 7:00 PM<br />
			Nevada Avenue Cul-de-sac
		</p>
		<div class="actions">
			<a href="/" class="btn btn-outline">Back to Event Info</a>
			<a href="/signup" class="btn btn-primary">Sign Up Another Person</a>
		</div>
	</div>
</main>

<style>
	.confirmation {
		text-align: center;
		padding: 4rem 1rem;
	}

	.icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 0.75rem;
	}

	p {
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
	}

	.muted {
		color: var(--color-text-muted);
		font-size: 1rem;
		margin-bottom: 2rem;
	}

	.actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
