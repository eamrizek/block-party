<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: signups = data.signups;
	$: categories = data.categories;
	$: totalSlots = categories.reduce((sum, c) => sum + c.max_slots, 0);
	$: filledSlots = categories.reduce((sum, c) => sum + c.signup_count, 0);

	function downloadCsv() {
		const headers = ['Name', 'Contact Info', 'Item Category', 'Notes', 'Signed Up At'];
		const rows = signups.map(s => [
			s.name,
			s.contact_info ?? '',
			s.category_name ?? '',
			s.notes ?? '',
			s.created_at
		]);
		const csv = [headers, ...rows]
			.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
			.join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'block-party-signups.csv';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>Dashboard – Admin</title>
</svelte:head>

<main class="container--wide">
	<div class="page-header">
		<h1>Dashboard</h1>
		<button class="btn btn-secondary btn-sm" on:click={downloadCsv}>
			Download CSV
		</button>
	</div>

	<div class="stats">
		<div class="stat-card card">
			<div class="stat-number">{signups.length}</div>
			<div class="stat-label">Total Sign-Ups</div>
		</div>
		<div class="stat-card card">
			<div class="stat-number">{filledSlots} / {totalSlots}</div>
			<div class="stat-label">Slots Filled</div>
		</div>
		<div class="stat-card card">
			<div class="stat-number">{categories.length}</div>
			<div class="stat-label">Item Categories</div>
		</div>
	</div>

	<div class="card table-card">
		<h2>All Sign-Ups</h2>
		{#if signups.length === 0}
			<p class="empty">No sign-ups yet.</p>
		{:else}
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Name</th>
							<th>Contact</th>
							<th>Item</th>
							<th>Notes</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{#each signups as s, i}
							<tr>
								<td class="muted">{i + 1}</td>
								<td><strong>{s.name}</strong></td>
								<td class="muted">{s.contact_info ?? '—'}</td>
								<td>{s.category_name}</td>
								<td class="muted">{s.notes ?? '—'}</td>
								<td class="muted nowrap">{new Date(s.created_at).toLocaleDateString()}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</main>

<style>
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 2rem 0 1rem;
	}

	h1 {
		margin: 0;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.stat-card {
		text-align: center;
		padding: 1.25rem;
	}

	.stat-number {
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-primary);
	}

	.stat-label {
		color: var(--color-text-muted);
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.table-card h2 {
		margin-top: 0;
	}

	.table-wrap {
		overflow-x: auto;
	}

	.muted {
		color: var(--color-text-muted);
	}

	.nowrap {
		white-space: nowrap;
	}

	.empty {
		color: var(--color-text-muted);
	}
</style>
