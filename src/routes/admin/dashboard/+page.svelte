<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: signups = data.signups;
	$: categories = data.categories;
	$: rsvps = data.rsvps;
	$: totalGuests = rsvps.reduce((sum, r) => sum + r.guest_count, 0);
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

	function downloadRsvpCsv() {
		const headers = ['Name', 'Contact Info', 'Party Size', 'Notes', 'RSVPed At'];
		const rows = rsvps.map(r => [
			r.name,
			r.contact_info ?? '',
			r.guest_count,
			r.notes ?? '',
			r.created_at
		]);
		const csv = [headers, ...rows]
			.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
			.join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'block-party-rsvps.csv';
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
	</div>

	<div class="stats">
		<div class="stat-card card">
			<div class="stat-number">{rsvps.length}</div>
			<div class="stat-label">RSVPs</div>
		</div>
		<div class="stat-card card">
			<div class="stat-number">{totalGuests}</div>
			<div class="stat-label">Total Guests</div>
		</div>
		<div class="stat-card card">
			<div class="stat-number">{signups.length}</div>
			<div class="stat-label">Potluck Sign-Ups</div>
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
		<div class="table-header">
			<h2>RSVPs</h2>
			<button class="btn btn-secondary btn-sm" on:click={downloadRsvpCsv}>Download CSV</button>
		</div>
		{#if rsvps.length === 0}
			<p class="empty">No RSVPs yet.</p>
		{:else}
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Name</th>
							<th>Contact</th>
							<th>Party Size</th>
							<th>Notes</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{#each rsvps as r, i}
							<tr>
								<td class="muted">{i + 1}</td>
								<td><strong>{r.name}</strong></td>
								<td class="muted">{r.contact_info ?? '—'}</td>
								<td>{r.guest_count}</td>
								<td class="muted">{r.notes ?? '—'}</td>
								<td class="muted nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<div class="card table-card">
		<div class="table-header">
			<h2>Potluck Sign-Ups</h2>
			<button class="btn btn-secondary btn-sm" on:click={downloadCsv}>Download CSV</button>
		</div>
		{#if signups.length === 0}
			<p class="empty">No potluck sign-ups yet.</p>
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

	.table-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.table-header h2 {
		margin: 0;
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
