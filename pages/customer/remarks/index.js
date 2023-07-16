const app = getApp();
const { utils, globalData, ROLES } = app;
import Notify from "@vant/weapp/notify/notify";
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		customerId: "",
		isShowHistoryRemarks: false,
		scrollTop: 0,
		remarks: "", // 备注
		remarkList: [], // 历史记录
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(opts) {
		this.data.customerId = opts.customerId;
		this.getRemarkList();
	},
	getRemarkList() {
		this.setData({
			remarkList: [
				{
					id: "",
					createTime: "2023-06-17 21:21:12",
					remark: "666",
				},
				{
					id: "",
					createTime: "2023-06-17 21:21:12",
					remark: "666",
				},
				{
					id: "",
					createTime: "2023-06-17 21:21:12",
					remark: "666",
				},
				{
					id: "",
					createTime: "2023-06-17 21:21:12",
					remark: "666",
				},
			],
		});
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
		const remarks = this.data.remarks;
		if (!remarks) {
			Notify({
				type: "danger",
				message: "请填写备注",
			});
			return;
		}
	},
});
