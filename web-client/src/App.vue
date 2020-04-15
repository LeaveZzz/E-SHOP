<template>
	<div id="app" class="minWid" >
		<header-nav v-if="$route.meta.showHeaderTop"></header-nav>
		<router-view></router-view>
	</div>
</template>

<script>
	import HeaderNav from 'components/headerNav/HeaderNav'
	export default {
		name: 'App',
		components: {
			HeaderNav
		}
	}
</script>

<style scoped>
	 .minWid{
		 min-width: 975px;
	 }
</style>
