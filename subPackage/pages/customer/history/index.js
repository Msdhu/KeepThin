const app = getApp();
const { utils, globalData } = app;
Page({
	data: {
		customerId: "",
		weightHistory: [],
		isShowEditPop: false,
		editId: "",
		weight: "",
	},
	onLoad(opts) {
		this.setData({
			customerId: opts?.customerId,
		}, () => {
			this.getWeightHistory();
		});
	},
	getWeightHistory() {
		const { customerId } = this.data;
		utils.request(
			{
				url: `member/weight-history`,
				data: {
					// 店铺id
					shop_id: globalData.storeInfo.id,
					customer_id: customerId,
				},
				method: "GET",
				success: res => {
					this.setData({
						weightHistory: (res || []).map((item, index) => ({
							createTime: item.date,
							currentWeight: item.weight,
							id: index,
						})),
					});
				},
			},
			true
		);
	},
	showEditPop(t) {
		var id = t.currentTarget.dataset.id;
		this.setData({
			isShowEditPop: true,
			editId: id,
		});
	},
	hideEditPop() {
		this.setData({
			isShowEditPop: false,
			weight: "",
			editId: "",
		});
	},
	// 保存今日体重
	handleSaveEdit() {
		const { editId, weight, customerId, weightHistory } = this.data;
		utils.request(
			{
				url: "member/weight-update",
				data: {
					// 店铺id
					shop_id: globalData.storeInfo.id,
					customer_id: customerId,
					ymd: weightHistory[editId].createTime,
					weight,
				},
				method: "POST",
				success: () => {
					this.getWeightHistory();
					wx.showToast({
						title: "保存成功",
						icon: "none",
					});
				},
				isShowLoading: true,
			},
			true
		);
		this.hideEditPop();
	},
});
