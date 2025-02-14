<template>
	<view>		
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="1==tabIndex?'text-sunway-blue cur':''"  @tap="tabSelect" :data-id="1">
					未受理
				</view>
				<view class="cu-item flex-sub" :class="2==tabIndex?'text-sunway-blue cur':''"  @tap="tabSelect" :data-id="2">
					已受理
				</view>
				<view class="cu-item flex-sub" :class="3==tabIndex?'text-sunway-blue cur':''"  @tap="tabSelect" :data-id="3">
					已完成
				</view>
			</view>
		</scroll-view>
		
		<view v-if="warning" class="topTip">
			<text class="cuIcon-warn text-yellow margin-right-sm"></text><text class="">未找到所属企业，请前往<text class="text-blue" @click="toPage('../mydetail/mydetail', true)">个人信息</text>中维护</text>
		</view>
		<sunway-empty-data v-if="noData" imgSrc="/static/image/cue/empty.svg"></sunway-empty-data>
		
		<view class="margin bg-white box-radius" v-for="item in entrustList"  @tap="toPage('../entrustdetail/entrustdetail?entrustId=' + item.id)">
			<view class="padding-lr padding-tb-xs solid-bottom"  >
				<text class="cuIcon-form text-sm text-sunway-blue margin-right-xs"></text><text class="text-df text-grey">{{item.entrustNo}}</text>
			</view>
			<view class="padding flex" >
				<view class="margin-right-sm">
					<image class="thumb-image" :src="item.ext$.thumburl" ></image>
				</view>
				<view class="text-box">
					<text>{{item.entrustContent}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { HTTP } from '../../common/http.js';
	export default {
		data() {
			return {
				tabIndex : 1,
				entrustList : [],
				accept : '',
				submit : '',
				noData : true,
				clientContactId : getApp().globalData.userInfo.clientContactId,
			}
		},
		computed : {
			warning(e) {
				return this.clientContactId == undefined || this.clientContactId == '';
			},
		},
		onLoad(e) {
			var _this = this;
			uni.$on('updateUserInfo',function(e){
				_this.clientContactId = e.clientContactId
			})
			this.selectEntrust(this.tabIndex)
		},
		onUnload() {
			uni.$off('updateUserInfo');
		},
		methods: {
			toPage : function (url){
				uni.navigateTo({
					url : url 
				})
			},
			tabSelect(e) {
				console.log(e)
				this.tabIndex = e.currentTarget.dataset.id;
				this.selectEntrust(this.tabIndex)
			},
			selectEntrust(tabIndex) {
				if (tabIndex === 1 ) {
					this.accept = 0
					this.submit = 0
				} else if(tabIndex === 2) {
					this.accept = 1
					this.submit = 0
				} else {
					this.accept = 1
					this.submit = 1
				}
				HTTP(`/open/emc/module/bp/wechat/select-entrust`,{
					clientContactId : getApp().globalData.userInfo.clientContactId,
					openId : getApp().globalData.openId,
					accept : this.accept, 
					submit : this.submit
				}).then(res=>{
					this.entrustList = res.data
					for (var i = 0; i < this.entrustList.length; i++) {
						if(this.entrustList[i].ext$.thumburl === undefined) {
							this.entrustList[i].ext$.thumburl = '../../static/logo.png'
						} else if (this.entrustList[i].ext$.thumburl.indexOf('http')  == -1) {
							this.entrustList[i].ext$.thumburl = getApp().globalData.host + this.entrustList[i].ext$.thumburl
						}
					}
					this.noData = this.entrustList.length == 0
				}).catch(err=>{
					this.entrustList = [];
					this.noData = true
				});
			}
		}
	}
</script>

<style>
	@import url(../selectentrust/selectentrust.css);
</style>
