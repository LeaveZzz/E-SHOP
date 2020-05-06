<template>
	<div id="app" class="minWid" >
		<header-nav v-if="$route.meta.showHeaderTop"></header-nav>
		<headerSearch v-show="$route.meta.showHeaderSearch"/>
		<router-view></router-view>
	</div>
</template>

<script>
	import HeaderNav from 'components/headerNav/HeaderNav'
	import HeaderSearch from 'components/headerSearch/HeaderSearch'
	export default {
		name: 'App',
		components: {
			HeaderNav,
			HeaderSearch
		}
	}
</script>

<style scoped>
	 .minWid{
		 min-width: 1100px;
	 }
</style>
