import Notify from "@vant/weapp/notify/notify";
const app = getApp();
const { utils, globalData } = app;

Page({
	data: {
		customerId: "",
		isShowHistoryRemarks: false,
		 // 备注
		remarks: "",
		// 历史记录
		remarkList: [],
	},
	onLoad(opts) {
		this.setData({
			customerId: opts.customerId,
		}, () => {
			this.getRemarkList();
		});
	},
	getRemarkList() {
		const { customerId } = this.data;
		utils.request(
			{
				url: `member/remark-history`,
				data: {
					// 店铺id
					shop_id: globalData.storeInfo.id,
					customer_id: customerId,
				},
				method: "GET",
				success: res => {
					this.setData({
						remarkList: (res || []).map(item => ({
							id: item?.id,
							createTime: item?.ymd,
							remark: item?.svalue || "",
						})),
					});
				},
			},
			true
		);
	},
	// 删除历史记录
	deleteHistoryRemark(e) {
		const index = e.currentTarget.dataset.index;
		const item = this.data.remarkList[index];
		wx.showModal({
			title: "提示",
			content: "是否确认删除该备注信息？",
			success: ({ confirm }) => {
				if (confirm) {
					// TODO: 调用接口
					wx.showToast({
						icon: "none",
						title: "删除成功",
					});
				}
			},
		});
	},
	showHistoryRemarks() {
		this.setData({
			isShowHistoryRemarks: true,
		});
	},
	hideHistoryRemarks() {
		this.setData({
			isShowHistoryRemarks: false,
		});
	},
	handleSave() {
		const { remarks, customerId } = this.data;
		if (!remarks) {
			Notify({
				type: "danger",
				message: "请填写备注",
			});
			return;
		}
		utils.request(
			{
				url: `member/remark-add`,
				data: {
					shop_id: globalData.storeInfo.id,
					customer_id: customerId,
					remark: remarks,
				},
				method: "POST",
				success: res => {
					wx.showToast({
						title: "添加成功",
						icon: "none",
					});
					this.getRemarkList();
				},
				isShowLoading: true,
			},
			true
		);
	},
});
