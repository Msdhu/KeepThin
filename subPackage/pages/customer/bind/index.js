const app = getApp();
const { utils, globalData } = app;

Page({
	data: {
		qrCodeImg: "",
	},
	onLoad(e) {
		const { qrCodeImgs } = globalData;
		if (qrCodeImgs[e.consumerId]) {
			this.setData({
				qrCodeImg: qrCodeImgs[e.consumerId],
			})
		} else {
			this.getSmallQrcode(e.consumerId);
		}
	},
	getSmallQrcode(consumerId) {
		utils.request(
			{
				url: `account/bind-shop`,
				data: {
					// 店铺id
					shop_id: globalData.storeInfo.id,
					customer_id: consumerId,
				},
				method: "GET",
				success: res => {
					globalData.qrCodeImgs[consumerId] = res?.url;

					this.setData({
						qrCodeImg: res?.url,
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
});
