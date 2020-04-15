<template>
	<div id="">
		<el-button type="info" @click="logout">退出</el-button>
	</div>
</template>

<script>
	import {
		isAdmin,
		adminLogout
	} from 'network/admin'
	export default {
		name: 'AdminHome',
		data() {
			return {

			}
		},
		async created() {
			//设置访问权限
			const result = await isAdmin();
			if (result.status_code === 400) {
				this.$msgbox({
					showClose: true,
					message: result.message,
					type: 'info'
				});
				return this.$router.replace('/adminlogin')
			}
		},
		methods: {
			//退出登录
			async logout() {
				const result = await adminLogout();
				this.$message({
					showClose: true,
					message: result.message,
					type: 'info'
				});
				this.$router.replace('/home')
			}
		}
	}
</script>

<style scoped>
</style>
