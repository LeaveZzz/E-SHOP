<template>
	<div id="">
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<el-row :gutter="20">
				<el-col :span="8" ><el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
					<el-button slot="append" icon="el-icon-search"></el-button>
				</el-input></el-col>
				<el-col :span="3"><el-button type="primary">添加用户</el-button></el-col>
			</el-row>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'UserList'
	}
</script>

<style scoped>
</style>
