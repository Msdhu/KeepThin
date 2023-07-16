const app = getApp();
const { utils, globalData, ROLES } = app;

Page({
	data: {
		durationInfo: { enter: 300, leave: 500 },
	},
	onLoad() {
		console.log(globalData.userInfo);
	},
	onShow() {
		setTimeout(function () {
			if (globalData.userInfo) {
				wx.redirectTo({
					url: "/pages/index/index",
				});
			} else {
				wx.redirectTo({
					url: "/pages/login/login",
				});
			}
		}, 1000);
	},
});
