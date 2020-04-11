<template>
	<div id="app">
		<h2>{{message}}</h2>
		<div v-show="isShow">
			<input type="text" v-model="userName"><br>
			<input type="password" v-model="passworld"><br>
			<button @click="btnClick">按钮</button>
		</div>
	</div>
</template>

<script>
	import {request} from '../network/request'
	export default {
		name: 'App',
		data() {
			return {
				userName: '',
				passworld:'',
				message:'Hello World!',
				isShow:true
			}
		},
		created() {
			// request({url:'index',params:{type:'pop',page:1}}).then(data=>{
			// 	console.log(data)
			// 	this.name = data.name
			// })
		},
		methods:{
			btnClick(){
				console.log(this.userName,this.passworld);
				request({url:'index',params:{userName:this.userName,password:this.passworld}}).then(data=>{
					console.log(data);
					if (data.success_code === 200) {
						this.message = `欢迎${data.message}来到米糕商城`;
						this.isShow = false;
					} else{
						alert(data.message)
					}
				})
			}
		}
	}
</script>

<style>
</style>
