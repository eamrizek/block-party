<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	$: categories = data.categories;

	function slotsLeft(cat: typeof categories[0]) {
		return cat.max_slots - cat.signup_count;
	}

	function badgeClass(cat: typeof categories[0]) {
		const left = slotsLeft(cat);
		if (left <= 0) return 'badge-full';
		if (left <= 2) return 'badge-low';
		return 'badge-available';
	}

	function badgeText(cat: typeof categories[0]) {
		const left = slotsLeft(cat);
		if (left <= 0) return 'Full';
		if (left === 1) return '1 spot left';
		return `${left} spots left`;
	}
</script>

<svelte:head>
	<title>Sign Up – Block Party</title>
</svelte:head>

<nav>
	<div class="inner">
		<a href="/" class="site-title">🎉 Block Party</a>
		<a href="/signup">Sign Up</a>
	</div>
</nav>

<main class="container">
	<h1>Sign Up to Bring Something</h1>
	<p class="intro">Pick an item from the list below and let us know you're bringing it. No account needed!</p>

	{#if form?.error}
		<div class="error">{form.error}</div>
	{/if}

	<form method="POST" use:enhance>
		<!-- Honeypot -->
		<div class="hp-field" aria-hidden="true">
			<label for="website">Website (leave blank)</label>
			<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
		</div>

		<div class="card">
			<h2>Your Info</h2>

			<div class="form-group">
				<label for="name">Your Name <span class="required">*</span></label>
				<input
					type="text"
					id="name"
					name="name"
					required
					maxlength="100"
					placeholder="Jane Smith"
				/>
			</div>

			<div class="form-group">
				<label for="contact_info">Contact Info <span class="optional">(optional)</span></label>
				<input
					type="text"
					id="contact_info"
					name="contact_info"
					maxlength="200"
					placeholder="Phone number or email"
				/>
				<small class="hint">Only visible to the organizer, not shared publicly.</small>
			</div>
		</div>

		<div class="card">
			<h2>What Will You Bring?</h2>

			{#if categories.length === 0}
				<p class="empty">No items have been set up yet. Check back soon!</p>
			{:else}
				<div class="category-list">
					{#each categories as cat}
						{@const left = slotsLeft(cat)}
						{@const isFull = left <= 0}
						<label class="category-item" class:disabled={isFull}>
							<input
								type="radio"
								name="category_id"
								value={cat.id}
								disabled={isFull}
								required
							/>
							<div class="category-info">
								<span class="category-name">{cat.name}</span>
								{#if cat.description}
									<span class="category-desc">{cat.description}</span>
								{/if}
							</div>
							<span class="badge {badgeClass(cat)}">{badgeText(cat)}</span>
						</label>
					{/each}
				</div>
			{/if}
		</div>

		<div class="card">
			<h2>Anything Else?</h2>
			<div class="form-group">
				<label for="notes">Notes <span class="optional">(optional)</span></label>
				<textarea
					id="notes"
					name="notes"
					rows="3"
					maxlength="500"
					placeholder="e.g. 'Gluten-free pasta salad' or 'I'll bring extra napkins too'"
				></textarea>
			</div>
		</div>

		<button type="submit" class="btn btn-primary btn-large">Sign Me Up!</button>
	</form>
</main>

<footer>
	<p><a href="/">← Back to event info</a></p>
</footer>

<style>
	h1 {
		padding-top: 2rem;
		margin-bottom: 0.5rem;
	}

	.intro {
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
	}

	.card {
		margin-bottom: 1.5rem;
	}

	.card h2 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.15rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.hp-field {
		position: absolute;
		left: -9999px;
		opacity: 0;
		pointer-events: none;
	}

	.required {
		color: var(--color-danger);
	}

	.optional {
		color: var(--color-text-muted);
		font-weight: normal;
		font-size: 0.9em;
	}

	.hint {
		display: block;
		color: var(--color-text-muted);
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.category-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.category-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border: 1.5px solid var(--color-border);
		border-radius: var(--radius);
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
	}

	.category-item:hover:not(.disabled) {
		border-color: var(--color-primary);
		background: #fef9f5;
	}

	.category-item:has(input:checked) {
		border-color: var(--color-primary);
		background: #fef5ec;
	}

	.category-item.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.category-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.category-name {
		font-weight: 600;
	}

	.category-desc {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.empty {
		color: var(--color-text-muted);
	}

	.btn-large {
		padding: 0.8rem 2rem;
		font-size: 1.1rem;
		margin-bottom: 3rem;
	}
</style>
