<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<svelte:head>
	<title>Admin Login – Block Party</title>
</svelte:head>

<nav>
	<div class="inner">
		<a href="/" class="site-title">🎉 Block Party</a>
	</div>
</nav>

<main class="container">
	<div class="login-wrap">
		<div class="card">
			<h1>Admin Login</h1>
			{#if form?.error}
				<div class="error">{form.error}</div>
			{/if}
			<form method="POST">
				<div class="form-group">
					<label for="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						required
					/>
				</div>
				<button type="submit" class="btn btn-primary">Log In</button>
			</form>
		</div>
	</div>
</main>

<style>
	.login-wrap {
		display: flex;
		justify-content: center;
		padding: 4rem 0;
	}

	.card {
		width: 100%;
		max-width: 360px;
	}

	h1 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.5rem;
	}

	.btn {
		width: 100%;
		text-align: center;
	}
</style>
