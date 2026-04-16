<script lang="ts">
	import { page } from '$app/stores';

	function isActive(path: string) {
		return $page.url.pathname === path;
	}
</script>

<nav>
	<div class="inner">
		<a href="/" class="site-title">🎉 Block Party</a>
		<a href="/" class:active={isActive('/')}>Event Info</a>
		<a href="/signup" class:active={isActive('/signup')}>RSVP & Potluck Sign-Up</a>
		<a href="/comments" class:active={isActive('/comments')}>Comments & Questions</a>
	</div>
</nav>

<style>
	.active {
		text-decoration: underline;
	}
</style>
