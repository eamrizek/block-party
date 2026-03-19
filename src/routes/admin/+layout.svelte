<script lang="ts">
</script>

<nav>
	<div class="inner">
		<a href="/" class="site-title">🎉 Block Party</a>
		<a href="/admin/dashboard">Dashboard</a>
		<a href="/admin/items">Items</a>
		<a href="/admin/logout" class="logout">Log Out</a>
	</div>
</nav>

<slot />

<style>
	.logout {
		margin-left: auto;
		opacity: 0.8;
	}
</style>
