<script lang="ts">
	const EVENT = {
		name: 'Nevada Avenue Block Party',
		date: 'Saturday, July 19, 2025',
		time: '3:00 PM – 8:00 PM',
		location: 'Nevada Avenue Cul-de-sac',
		address: '100–200 Block of Nevada Avenue',
		description: `Join your neighbors for our annual block party! We'll have lawn games, music, and great food. Bring the whole family — kids, dogs, and lawn chairs welcome.`
	};
</script>

<svelte:head>
	<title>{EVENT.name}</title>
</svelte:head>

<nav>
	<div class="inner">
		<span class="site-title">🎉 {EVENT.name}</span>
		<a href="/signup">Sign Up</a>
	</div>
</nav>

<main class="container">
	<section class="hero">
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
					<span class="muted">{EVENT.address}</span>
				</div>
			</div>
		</div>
		<p class="description">{EVENT.description}</p>
		<a href="/signup" class="btn btn-primary">Sign Up to Bring Something</a>
	</section>

	<section class="what-to-bring card">
		<h2>What to Bring</h2>
		<p>We're coordinating who brings what so we have a great spread without duplicates. Sign up below to claim a spot!</p>
		<ul>
			<li>A dish to share (appetizer, main, side, or dessert)</li>
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
		padding: 3rem 0 2rem;
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
