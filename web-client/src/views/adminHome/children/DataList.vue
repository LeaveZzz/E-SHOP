<template>
	<div>
		<!-- 面包屑导航 -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/adminhome' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>数据统计</el-breadcrumb-item>
			<el-breadcrumb-item>数据列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区 -->
		<el-card>
			<!-- 为ECharts准备一个具备大小（宽高）的Dom -->
			<div id="main" style="min-width: 750px;height:500px;"></div>
		</el-card>
	</div>
</template>

<script>
	//引入echarts图表
	import echarts from 'echarts'
	import {
		getDataList
	} from 'network/admin'
	export default {
		name: 'DataList',
		created() {
			
		},
		async mounted() {
			// 基于准备好的dom，初始化echarts实例
			let myChart = echarts.init(document.getElementById('main'));

			// 获取图表的配置项和数据
			let result = await getDataList();
			
			// 使用配置项和数据显示图表
			myChart.setOption(result.option);
		},
	}
</script>

<style scoped>
</style>
