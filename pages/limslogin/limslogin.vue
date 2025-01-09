<template>
	<view>
		<sunway-navbar title="实验室信息管理系统"></sunway-navbar>
		<view class="login-box">
			<view class="login-img-box">
				<image mode="widthFix" src="../../static/image/sunway-logo.jpg"></image>
			</view>
			<view class="login-error" :style="{ visibility: errorMessage ? 'visible' : 'hidden' }"><text class="cuIcon-info margin-right-xs"></text><text>{{errorMessage}}</text></view>
			<view class="login-input-box">
				<view class="input-line">
					<view class="cuIcon-people margin-right"></view>
					<input type="text" placeholder="请输入用户名" v-model="username"/>
				</view>
				<view class="input-line"> 
					<view class="cuIcon-lock margin-right"></view>
					<input :password="!showPassword"  placeholder="请输入密码" v-model="password"/>
					<view class="attention_status" @tap="toggleShowPassword">
						<view class="cuIcon-attention" v-if="!showPassword"></view>
						<view class="cuIcon-attentionforbid" v-if="showPassword"></view>
					</view>
				</view>
			</view>
			
			<button class="button bt-sunway-blue"  @click="limslogin"><text class="text-white">登录</text></button>
			
		</view>
	</view>
</template>

<script>
	import limslogin from './limslogin.js'
	export default {
		data() {
			return {
				showPassword : false,
				username : '',
				password : '',
				errorMessage : null
			} 
		},
		onShow : function(e) {
			try {
				var value = uni.getStorageSync('username');
				this.username = value;
			} catch (e) {
				this.username = "";
			}
		},
		methods: {
			validate: function () {
				if (!this.username) {
					this.errorMessage = '请输入用户名';
					return false;
				}
				if (!this.password) {
					this.errorMessage = '请输入密码';
					return false;
				}
				this.errorMessage = null;
				return true;
			},
			limslogin : function() {
				if (this.validate() === false) {
					return;
				}
				var username = this.username;
				var password = this.password;
				limslogin.methods.limsLogin(username, password);
			},
			toggleShowPassword : function() {
				console.log('hhhh');
				this.showPassword = !this.showPassword;
			}
		}
	}
</script>

<style>
	@import url(../limslogin/limslogin.css);
</style>
