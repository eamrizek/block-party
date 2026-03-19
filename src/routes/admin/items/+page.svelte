<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	$: categories = data.categories;

	let editingId: number | null = null;

	function startEdit(id: number) {
		editingId = id;
	}

	function cancelEdit() {
		editingId = null;
	}
</script>

<svelte:head>
	<title>Manage Items – Admin</title>
</svelte:head>

<main class="container">
	<div class="page-header">
		<h1>Manage Item Categories</h1>
	</div>

	{#if form?.error}
		<div class="error">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="success">{form.success}</div>
	{/if}

	<!-- Add new category -->
	<div class="card">
		<h2>Add New Category</h2>
		<form method="POST" action="?/create" use:enhance>
			<div class="form-row">
				<div class="form-group">
					<label for="new-name">Item Name <span class="required">*</span></label>
					<input type="text" id="new-name" name="name" required maxlength="100" placeholder="e.g. Potato Salad" />
				</div>
				<div class="form-group slots-field">
					<label for="new-max_slots">Max Slots <span class="required">*</span></label>
					<input type="number" id="new-max_slots" name="max_slots" required min="1" max="100" value="1" />
				</div>
			</div>
			<div class="form-group">
				<label for="new-description">Description <span class="optional">(optional)</span></label>
				<input type="text" id="new-description" name="description" maxlength="300" placeholder="e.g. Any style welcome" />
			</div>
			<button type="submit" class="btn btn-primary">Add Category</button>
		</form>
	</div>

	<!-- Existing categories -->
	<div class="card">
		<h2>Existing Categories</h2>
		{#if categories.length === 0}
			<p class="empty">No categories yet. Add one above!</p>
		{:else}
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Slots</th>
						<th>Filled</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each categories as cat}
						{#if editingId === cat.id}
							<tr class="editing-row">
								<td colspan="5">
									<form method="POST" action="?/update" use:enhance on:submit={() => (editingId = null)}>
										<input type="hidden" name="id" value={cat.id} />
										<div class="edit-form">
											<div class="form-row">
												<div class="form-group">
													<label for="edit-name-{cat.id}">Name</label>
													<input id="edit-name-{cat.id}" type="text" name="name" value={cat.name} required maxlength="100" />
												</div>
												<div class="form-group slots-field">
													<label for="edit-slots-{cat.id}">Max Slots</label>
													<input id="edit-slots-{cat.id}" type="number" name="max_slots" value={cat.max_slots} required min="1" max="100" />
												</div>
											</div>
											<div class="form-group">
												<label for="edit-desc-{cat.id}">Description</label>
												<input id="edit-desc-{cat.id}" type="text" name="description" value={cat.description ?? ''} maxlength="300" />
											</div>
											<div class="edit-actions">
												<button type="submit" class="btn btn-primary btn-sm">Save</button>
												<button type="button" class="btn btn-outline btn-sm" on:click={cancelEdit}>Cancel</button>
											</div>
										</div>
									</form>
								</td>
							</tr>
						{:else}
							<tr>
								<td><strong>{cat.name}</strong></td>
								<td class="muted">{cat.description ?? '—'}</td>
								<td>{cat.max_slots}</td>
								<td>
									{#if cat.signup_count >= cat.max_slots}
										<span class="badge badge-full">{cat.signup_count}/{cat.max_slots} Full</span>
									{:else}
										<span class="badge badge-available">{cat.signup_count}/{cat.max_slots}</span>
									{/if}
								</td>
								<td>
									<button class="btn btn-outline btn-sm" on:click={() => startEdit(cat.id)}>Edit</button>
									{#if cat.signup_count === 0}
										<form method="POST" action="?/delete" use:enhance style="display:inline">
											<input type="hidden" name="id" value={cat.id} />
											<button
												type="submit"
												class="btn btn-danger btn-sm"
												on:click|preventDefault={(e) => {
													if (confirm(`Delete "${cat.name}"?`)) {
														(e.target as HTMLElement).closest('form')?.submit();
													}
												}}
											>Delete</button>
										</form>
									{:else}
										<span class="muted btn-sm" title="Cannot delete: has sign-ups">Delete</span>
									{/if}
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</main>

<style>
	.page-header {
		padding: 2rem 0 1rem;
	}

	h1 {
		margin: 0;
	}

	.card {
		margin-bottom: 1.5rem;
	}

	.card h2 {
		margin-top: 0;
	}

	.form-row {
		display: flex;
		gap: 1rem;
	}

	.form-row .form-group {
		flex: 1;
	}

	.slots-field {
		flex: 0 0 120px !important;
	}

	.required {
		color: var(--color-danger);
	}

	.optional {
		color: var(--color-text-muted);
		font-weight: normal;
		font-size: 0.9em;
	}

	.muted {
		color: var(--color-text-muted);
	}

	.empty {
		color: var(--color-text-muted);
	}

	.editing-row td {
		background: #f8f9fa;
		padding: 1rem;
	}

	.edit-form {
		max-width: 600px;
	}

	.edit-actions {
		display: flex;
		gap: 0.5rem;
	}
</style>
