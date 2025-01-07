<script>
	export default {
		data() {
			return {
			};
		},
		globalData : {
			// host : 'http://47.120.13.240:8089',
			host : 'http://lims.zfjcjs.com:8089',
			// host : 'http://localhost:8087',
			// host : 'http://192.168.56.1:8087',
			// host : 'http://cn-qz-plc-1.ofalias.net:55134',
			method : 'POST',
			UserLogin : false,
			appId : 'wx9a921cc8d181e292',
			// appId : 'wxa6b4df1015ec63f9',
			openId : '',
			phoneNumber : '',
			userInfo : {},
			folderList : [],
			orderList : [],
			mch_key : '',//商户密钥
			sessionKey : '',// 微信会话密钥
			cookie : '', // sunway-remember-me-cookie
			
			// 不同机型页面信息
			navHeight : '',// 整个导航栏的高度
			nav : '',// 导航栏的高度
			menuLeft : '', //胶囊与左边的距离
			menuHeight : '', //胶囊的高度
			menuBot : '', //胶囊距离顶部的高度
			windowWidth : '' ,//整个设备的宽度
			unSafeButtomHeight : '' ,//底部非安全区域高度
			
			// 红点信息
			redDotCue : {}
		},
		methods : {
			
		},
		onLaunch: function() {
			console.log('App Launch')
			// 初始化
			wx.request({
				url: this.globalData.host + '/open/emc/module/bp/wechat/app-init',
				data: {
				},
				method : 'POST',
				success: (appInitData) =>{
					console.log("获取初始化参数",appInitData)
					this.globalData.questionnaireUrl = appInitData.data.questionnaireUrl
					this.globalData.officialWebsite = appInitData.data.officialWebsite
				},
				fail: appInitData=>{
					console.log('获取初始化参数失败',appInitData);
					
				},
			});
			// 获取胶囊信息
			let menuButtonObject = wx.getMenuButtonBoundingClientRect()
			// 获取设备信息
			wx.getSystemInfo({
			  success: res => {
				// 整个导航栏的高度
				let navHeight = res.statusBarHeight + menuButtonObject.height + (menuButtonObject.top - res.statusBarHeight)*2
				// 导航栏的高度
				let nav = navHeight - res.statusBarHeight
		 
				// 挂载到全区变量 globalData 上
				this.globalData.navHeight = navHeight
				this.globalData.nav = nav
				console.log("导航栏的高度 + 真机状态栏高度",navHeight)
				console.log("导航栏的高度",nav)
				// 胶囊与左边的距离
				this.globalData.menuLeft = menuButtonObject.left
				// 胶囊的高度
				this.globalData.menuHeight = menuButtonObject.height
				// 胶囊距离顶部的高度
				this.globalData.menuBot = menuButtonObject.top - res.statusBarHeight
				// 整个设备的宽度
				this.globalData.windowWidth = res.windowWidth
				// 底部非安全区域高度
				this.globalData.unSafeButtomHeight = res.screenHeight - res.safeArea.bottom
			  },
			  fail: err => {
				console.log(err)
			  }
			})

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/uni.css';
	@import '@/static/customicons.css';
	@import '@/static/iconfont.css';
	
	@import "./colorui/main.css";
	@import "./colorui/icon.css";
	
	/* ==================
	        定义颜色
	 ==================== */
	 /* css也同样可以定义变量 */
	 /* web开发中顶层变量的key名是:root，小程序使用page */
	 page {
	   --sunway-primary-color:  #4aa1ed;
	   --sunway-minor-color: #295290;
	   --sunway-primary-background-color: #f6f6f6;
	 }
	 
	/**文本**/
	.text-sunway-blue,
	.line-sunway-blue,
	.lines-sunway-blue {
		color: var(--sunway-primary-color);
	}
	
	/**背景**/
	.bg-sunway-gradual-blue {
		background-image: linear-gradient(45deg, #0081ff, var(--sunway-primary-color));
		color: #ffffff;
	}
	.bg-sunway-blue {
		background-color: var(--sunway-primary-color);
		color: #ffffff;
	}
	.bg-sunway-grey {
		background-color: #819191;
		color: #ffffff;
	}
	/**按钮**/
	.bt-sunway-blue {
		background-color: var(--sunway-minor-color, black);
		color: #ffffff;
	}
</style>
	
