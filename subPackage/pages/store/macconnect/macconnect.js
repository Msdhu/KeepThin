const app = getApp();
const { utils, globalData } = app;

Page({
	data: {
		mac: "",
		deviceId: "",
	},

	handleSave() {
		const { mac, deviceId } = this.data;
		if (!(mac && deviceId)) {
			wx.showToast({
				icon: "none",
				title: "请填写完整关联信息",
			});
		}
		// 店铺id
		const { id } = globalData.storeInfo;
		utils.request(
			{
				url: `shop/mac-edit`,
				data: {
					shop_id: id,
					mac_addr: mac,
					device_no: deviceId,
				},
				method: "POST",
				success: res => {
					wx.showToast({
						title: "保存成功",
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
});
