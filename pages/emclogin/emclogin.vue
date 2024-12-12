<template>
	<view>
		<sunway-navbar title="实验室信息管理系统"></sunway-navbar>
		<view class="login-box">
			<view class="login-img-box">
				<image mode="widthFix" src="../../static/image/sunway-logo.png"></image>
			</view>
			<view class="login-input-box">
				<view class="input-line">
					<view class="cuIcon-people margin-right"></view>
					<input type="text" placeholder="请输入用户名"/>
				</view>
				<view class="input-line">
					<view class="cuIcon-lock margin-right"></view>
					<input :password="!showPassword" placeholder="请输入密码"/>
					<view class="attention_status" @tap="toggleShowPassword">
						<view class="cuIcon-attention" v-if="!showPassword"></view>
						<view class="cuIcon-attentionforbid" v-if="showPassword"></view>
					</view>
				</view>
			</view>
			
			<button class="button"  @click="emcLogin"><text class="text-white">登录</text></button>
			
		</view>
	</view>
</template>

<script>
	import emclogin from './emclogin.js'
	export default {
		data() {
			return {
				showPassword : false
			}
		},
		methods: {
			emcLogin : function() {
				emclogin.methods.login(e);
			},
			toggleShowPassword : function() {
				console.log('hhhh');
				this.showPassword = !this.showPassword;
			}
		}
	}
</script>

<style>
	@import url(../emclogin/emclogin.css);
</style>
