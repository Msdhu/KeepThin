const app = getApp();
const { utils, globalData } = app;

Page({
	data: {
		qrCodeImg: "",
	},
	onLoad() {
		const { qrCodeImgs, storeInfo } = globalData;
		const key = `shopId-${storeInfo.id}`;
		if (qrCodeImgs[key]) {
			this.setData({
				qrCodeImg: qrCodeImgs[key],
			})
		} else {
			this.getSmallQrcode();
		}
	},
	getSmallQrcode() {
		utils.request(
			{
				url: `shop/code`,
				method: "GET",
				success: res => {
					globalData.qrCodeImgs[`shopId-${globalData.storeInfo.id}`] = res?.url;

					this.setData({
						qrCodeImg: res?.url,
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
	onPreviewImage() {
		wx.previewImage({
			urls: [this.data.qrCodeImg],
		});
	},
});
