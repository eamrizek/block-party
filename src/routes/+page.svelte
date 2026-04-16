<script lang="ts">
	import Nav from '$lib/Nav.svelte';

	const EVENT = {
		name: 'Nevada/Jansen/Hill Avenues Block Party',
		date: 'Saturday, June 20, 2026',
		time: '3:00 PM – 7:00 PM',
		location: 'Curtiss Ave between Nevada Ave and Jansen Ave',
		address: '',
		description: `Join your neighbors for our annual block party! We'll have games, music, and great food. Bring the whole family — kids, dogs, and lawn chairs welcome. And stay tuned… we may have a sweet surprise in store. 🤫`
	};
</script>

<svelte:head>
	<title>{EVENT.name}</title>
</svelte:head>

<Nav />

<main class="container">
	<section class="hero card">
		<h1>{EVENT.name}</h1>
		<div class="event-details">
			<div class="detail">
				<span class="detail-icon">📅</span>
				<div>
					<strong>Date</strong>
					<span>{EVENT.date}</span>
				</div>
			</div>
			<div class="detail">
				<span class="detail-icon">🕒</span>
				<div>
					<strong>Time</strong>
					<span>{EVENT.time}</span>
				</div>
			</div>
			<div class="detail">
				<span class="detail-icon">📍</span>
				<div>
					<strong>Location</strong>
					<span>{EVENT.location}</span>
				</div>
			</div>
		</div>
		<img src="/block_party_location.png" alt="Map showing Curtiss Ave between Nevada Ave and Jansen Ave" class="location-map" />
		<p class="description">{EVENT.description}</p>
		<a href="/signup" class="btn btn-primary">Sign Up to Bring Something</a>
	</section>

	<section class="what-to-bring card">
		<h2>What to Bring</h2>
		<p>We're coordinating who brings what so we have a great spread without duplicates. Sign up below to claim a spot!</p>
		<ul>
			<li>A dish to share</li>
			<li>Wine, beer, or canned cocktails for yourself and/or to share</li>
			<li>Lawn chairs or a blanket</li>
			<li>Your favorite outdoor game</li>
			<li>Your best neighborhood stories 😄</li>
		</ul>
		<a href="/signup" class="btn btn-outline">Claim Your Spot →</a>
	</section>
</main>

<footer>
	<p>Questions? Ask a neighbor! &nbsp;·&nbsp; <a href="/admin">Admin</a></p>
</footer>

<style>
	.hero {
		padding: 2rem 1.5rem;
		margin-top: 2rem;
		margin-bottom: 1.5rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 1.5rem;
		color: var(--color-primary);
	}

	.event-details {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.detail {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.detail-icon {
		font-size: 1.25rem;
		margin-top: 0.1rem;
	}

	.detail div {
		display: flex;
		flex-direction: column;
	}

	.muted {
		color: var(--color-text-muted);
		font-size: 0.9rem;
	}

	.location-map {
		width: 100%;
		border-radius: var(--radius);
		margin-bottom: 1.5rem;
	}

	.description {
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
		max-width: 600px;
	}

	.what-to-bring {
		margin-bottom: 2rem;
	}

	ul {
		padding-left: 1.25rem;
	}

	li {
		margin-bottom: 0.4rem;
	}
</style>
