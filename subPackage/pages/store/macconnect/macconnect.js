const app = getApp();
const { utils, globalData, ROLES } = app;
Page({
	data: {
		mac: "",
		deviceId: "",
	},
	onLoad(e) {},
	onReady() {},
	onShow() {},
	handleSave() {
		const { mac, deviceId } = this.data;
		let isSuccess = true;
		if (mac && deviceId) {
			if (isSuccess) {
				wx.showToast({
					title: "关联成功",
				});
			} else {
				wx.showToast({
					icon: "none",
					title: "关联失败",
				});
			}
		} else {
			wx.showToast({
				icon: "none",
				title: "请填写完整关联信息",
			});
		}
	},
});
