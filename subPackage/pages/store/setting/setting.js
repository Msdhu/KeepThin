import Notify from "@vant/weapp/notify/notify";

const app = getApp();
const { utils, globalData } = app;

Page({
	data: {
		tabsList: [
			{ name: "身体部位", index: 0 },
			{ name: "服务人员", index: 1 },
			{ name: "其他", index: 2 },
		],
		tabIndex: 0,
		// 身体部位列表
		serviceList: [],
		// 服务人员列表
		staffList: [],
		isEdit: false,
		formValue: "",
		isShowAddPop: false,

		// 预加载店铺设置小程序码图片
		qrCodePreViewImg: "",
	},
	onLoad() {
		this.getShopSettingInfo();
	},
	getShopSettingInfo() {
		// 店铺id
		const { id } = globalData.storeInfo;
		utils.request(
			{
				url: `shop/config`,
				data: {
					shop_id: id,
				},
				method: "GET",
				success: res => {
					this.setData({
						serviceList: (res?.shop_bodys || []).sort((a = {}, b = {}) => {
							return Number(a.sort || 0) - Number(b.sort || 0);
						}),
						staffList: res?.shop_members || [],
					});
				},
			},
			true
		);
	},
	getSmallQrcode() {
		const { qrCodeImgs, storeInfo } = globalData;
		const key = `shopId-${storeInfo.id}`;

		if (qrCodeImgs[key]) return;

		utils.request(
			{
				url: `shop/code`,
				method: "GET",
				success: res => {
					globalData.qrCodeImgs[key] = res?.url;

					this.setData({
						qrCodePreViewImg: res?.url,
					});
				},
			},
			true
		);
	},
	tabChangeListener(e) {
		this.setData({
			tabIndex: e.detail,
			isEdit: false,
		});
		if (Number(e.detail) === 2) {
			this.getSmallQrcode();
		}
	},
	handleEdit() {
		this.setData({
			isEdit: true,
		});
	},
	handleSave() {
		const { tabIndex, staffList, serviceList } = this.data;
		const isSaveService = tabIndex === 0;
		// 店铺id
		const { id } = app.globalData.storeInfo;
		utils.request(
			{
				url: isSaveService ? `shop/body-save` : `shop/members-save`,
				data: {
					shop_id: id,
					list: isSaveService
						? serviceList.map((item, index) => ({ ...item, sort: index }))
						: staffList.map((item, index) => ({ ...item, sort: index })),
				},
				method: "POST",
				success: () => {
					this.setData({
						isEdit: false,
						// 身体部位列表
						serviceList: [],
						// 服务人员列表
						staffList: [],
					});
					this.getShopSettingInfo();
				},
				isShowLoading: true,
			},
			true
		);
	},
	// 提升服务项目排序
	handleTopService(e) {
		const index = e.currentTarget.dataset.index;
		if (!this.data.isEdit || index === 0) return;

		const { serviceList } = this.data;
		// 交换数组的两个值
		[serviceList[index], serviceList[index - 1]] = [serviceList[index - 1], serviceList[index]];
		this.setData({
			serviceList,
		});
	},
	handleDelete(e) {
		const index = e.currentTarget.dataset.index;
		wx.showModal({
			title: "提示",
			content: "是否确认删除？",
			success: t => {
				if (t.confirm) {
					const { tabIndex, staffList, serviceList } = this.data;
					if (tabIndex == 0) {
						serviceList.splice(index, 1);
						this.setData({
							serviceList,
						});
					}
					if (tabIndex == 1) {
						staffList.splice(index, 1);
						this.setData({
							staffList,
						});
					}
				}
			},
		});
	},
	openAdd() {
		this.setData({
			isShowAddPop: true,
		});
	},
	handleCloseAddPop() {
		this.setData({
			formValue: "",
			isShowAddPop: false,
		});
	},
	handleAddSave() {
		const { formValue, tabIndex, staffList, serviceList } = this.data;
		if (!formValue) {
			Notify({
				type: "danger",
				message: "请填写完整信息！",
			});
			return;
		}

		if (tabIndex == 0) {
			// 添加身体部位
			serviceList.push({
				name: formValue,
				sort: serviceList.length,
			});
			this.setData({
				serviceList,
			});
		}
		if (tabIndex == 1) {
			// 添加服务人员
			staffList.push({
				name: formValue,
				sort: staffList.length,
			});
			this.setData({
				staffList,
			});
		}
		this.handleCloseAddPop();
	},
	handleGoto(e) {
		const url = e.currentTarget.dataset.url;
		wx.navigateTo({
			url,
		});
	},
});
