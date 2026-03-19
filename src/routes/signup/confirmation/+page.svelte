<script lang="ts">
	import { page } from '$app/stores';
	const name = $page.url.searchParams.get('name') || 'Neighbor';
</script>

<svelte:head>
	<title>Thanks! – Block Party</title>
</svelte:head>

<nav>
	<div class="inner">
		<a href="/" class="site-title">🎉 Block Party</a>
	</div>
</nav>

<main class="container">
	<div class="confirmation">
		<div class="icon">🎊</div>
		<h1>You're on the list, {name}!</h1>
		<p>Thanks for signing up. We can't wait to see you at the block party!</p>
		<p class="muted">
			Saturday, July 19, 2025 · 3:00 PM – 8:00 PM<br />
			Maplewood Drive Cul-de-sac
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
