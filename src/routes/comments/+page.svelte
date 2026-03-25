<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import Nav from '$lib/Nav.svelte';

	export let data: PageData;
	export let form: ActionData;

	let replyingTo: number | null = null;

	function formatDate(dateStr: string) {
		return new Date(dateStr + 'Z').toLocaleDateString('en-US', {
			month: 'short', day: 'numeric', year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Comments & Questions – Block Party</title>
</svelte:head>

<Nav />

<main class="container">
	<div class="card title-card">
		<h1>Comments & Questions</h1>
		<p class="intro">Have a question or something to share with the neighborhood? Post it here!</p>
	</div>

	<div class="card form-card">
		<h2>Leave a Comment</h2>

		{#if form?.success && !form?.parent_id}
			<div class="success">Your comment was posted! Thanks for sharing.</div>
		{/if}
		{#if form?.error}
			<div class="error">{form.error}</div>
		{/if}

		<form method="POST" use:enhance>
			<div class="hp-field" aria-hidden="true">
				<label for="website">Website (leave blank)</label>
				<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
			</div>

			<div class="form-group">
				<label for="name">Your Name <span class="required">*</span></label>
				<input type="text" id="name" name="name" required maxlength="100" placeholder="Jane Smith" />
			</div>

			<div class="form-group">
				<label for="message">Comment or Question <span class="required">*</span></label>
				<textarea id="message" name="message" rows="4" required maxlength="1000"
					placeholder="Ask a question or share something with the neighborhood..."></textarea>
			</div>

			<button type="submit" class="btn btn-primary">Post Comment</button>
		</form>
	</div>

	<section class="comments-section">
		<h2>From the Neighborhood</h2>

		{#if data.comments.length === 0}
			<p class="empty">No comments yet — be the first!</p>
		{:else}
			<div class="comment-list">
				{#each data.comments as comment}
					<div class="comment card">
						<div class="comment-header">
							<span class="comment-name">{comment.name}</span>
							<span class="comment-date">{formatDate(comment.created_at)}</span>
						</div>
						<p class="comment-message">{comment.message}</p>

						<button class="reply-toggle" on:click={() => replyingTo = replyingTo === comment.id ? null : comment.id}>
							{replyingTo === comment.id ? 'Cancel' : '↩ Reply'}
						</button>

						{#if replyingTo === comment.id}
							<div class="reply-form">
								{#if form?.success && form?.parent_id === comment.id}
									<div class="success">Reply posted!</div>
								{/if}
								<form method="POST" use:enhance={{ onResult: () => { replyingTo = null; } }}>
									<div class="hp-field" aria-hidden="true">
										<label for="website-{comment.id}">Website (leave blank)</label>
										<input type="text" id="website-{comment.id}" name="website" tabindex="-1" autocomplete="off" />
									</div>
									<input type="hidden" name="parent_id" value={comment.id} />
									<div class="form-group">
										<label for="reply-name-{comment.id}">Your Name <span class="required">*</span></label>
										<input type="text" id="reply-name-{comment.id}" name="name" required maxlength="100" placeholder="Jane Smith" />
									</div>
									<div class="form-group">
										<label for="reply-message-{comment.id}">Reply <span class="required">*</span></label>
										<textarea id="reply-message-{comment.id}" name="message" rows="3" required maxlength="1000" placeholder="Write a reply..."></textarea>
									</div>
									<button type="submit" class="btn btn-primary btn-sm">Post Reply</button>
								</form>
							</div>
						{/if}

						{#if comment.replies && comment.replies.length > 0}
							<div class="replies">
								{#each comment.replies as reply}
									<div class="reply">
										<div class="comment-header">
											<span class="comment-name">{reply.name}</span>
											<span class="comment-date">{formatDate(reply.created_at)}</span>
										</div>
										<p class="comment-message">{reply.message}</p>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</section>
</main>

<footer>
	<p><a href="/">← Back to event info</a></p>
</footer>

<style>
	.title-card {
		margin-top: 2rem;
		margin-bottom: 1.5rem;
	}

	h1 {
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.intro {
		color: var(--color-text-muted);
		margin-bottom: 0;
	}

	.form-card {
		margin-bottom: 2rem;
	}

	h2 {
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

	.comments-section {
		margin-bottom: 3rem;
	}

	.comment-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.comment {
		padding: 1rem 1.25rem;
	}

	.comment-header {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		margin-bottom: 0.4rem;
	}

	.comment-name {
		font-weight: 700;
	}

	.comment-date {
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}

	.comment-message {
		margin: 0 0 0.75rem 0;
		white-space: pre-wrap;
	}

	.reply-toggle {
		background: none;
		border: none;
		color: var(--color-primary);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		padding: 0;
	}

	.reply-toggle:hover {
		text-decoration: underline;
	}

	.reply-form {
		margin-top: 1rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: var(--radius);
		border-left: 3px solid var(--color-primary);
	}

	.replies {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.reply {
		padding: 0.75rem 1rem;
		background: #f8f9fa;
		border-radius: var(--radius);
		border-left: 3px solid var(--color-border);
	}

	.reply .comment-message {
		margin: 0;
	}

	.empty {
		color: var(--color-text-muted);
	}
</style>
