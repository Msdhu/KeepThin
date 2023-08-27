const app = getApp();
const { utils, globalData } = app;

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		showProduct: false,
		 // 购买历史
		historyList: [],
		// 产品列表，用于添加
		productArray: [],
		productIndex: 0,
		selectProList: [],
		isShowAddPop: false,
	},
	onLoad(opts) {
		this.setData({
			customerId: opts.customerId,
		}, () => {
			this.getHistoryList();
			this.getProList();
		});
	},
	getHistoryList() {
		const { customerId } = this.data;
		utils.request(
			{
				url: `project/product-history`,
				data: {
					// 店铺id
					shop_id: globalData.storeInfo.id,
					customer_id: customerId,
				},
				method: "GET",
				success: res => {
					this.setData({
						historyList: (res || []).map(item => ({
							id: item?.history_id,
							createTime: item?.ymd,
							useCount: item?.used_num || 0,
							name: item?.good_name,
							price: item?.price,
							num: item?.good_num,
						})),
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
	getProList() {
		// 店铺id
		const { id } = globalData.storeInfo;
		utils.request(
			{
				url: `goods/skus`,
				data: {
					shop_id: id,
				},
				method: "GET",
				success: res => {
					let list = res;
					if (!Array.isArray(res)) {
						list = Object.keys(res || {}).map(id => ({ ...res[id], id }));
					}
					this.setData({
						// 过滤掉没库存的产品
						productArray: list.filter(item => Number(item.remain) > 0).map(item => ({
							id: item.id,
							name: item.good_name,
							remain: item.remain,
						})),
					});
				},
			},
			true
		);
	},
	// 撤销购买记录
	handleRevokeHistory(e) {
		const id = e.currentTarget.dataset.id;
		wx.showModal({
			title: "提示",
			content: "是否确认撤销该记录？",
			success: ({ confirm }) => {
				if (confirm) {
					// 店铺id
					const { id: shopId } = globalData.storeInfo;
					const { customerId } = this.data;
					utils.request(
						{
							url: `project/product-del`,
							data: {
								shop_id: shopId,
								customer_id: customerId,
								history_id: id,
							},
							method: "POST",
							success: res => {
								wx.showToast({
									title: "撤销成功",
									icon: "none",
								});
								this.getHistoryList();
							},
							isShowLoading: true,
						},
						true
					);
				}
			},
		});
	},
	// 展开添加弹窗
	showAddPop() {
		this.setData({
			isShowAddPop: true,
		});
	},
	// 关闭添加弹窗
	hideAddPop() {
		this.setData({
			selectProList: [],
			isShowAddPop: false,
		});
	},
	// 保存添加
	handleSaveAdd() {
		// 店铺id
		const { id: shopId } = globalData.storeInfo;
		const { customerId, selectProList } = this.data;
		if (!selectProList.length)	return;

		utils.request(
			{
				url: `project/product-add`,
				data: {
					shop_id: shopId,
					customer_id: customerId,
					good_list: selectProList.map(item => ({
						good_id: item?.id,
						good_num: item?.num,
					})),
				},
				method: "POST",
				success: res => {
					wx.showToast({
						title: "添加成功",
						icon: "none",
					});
					this.hideAddPop();
					this.getHistoryList();
				},
				isShowLoading: true,
			},
			true
		);	
	},
	// 选中产品
	handleSelectPro(e) {
		const index = e.detail.value;
		const { productArray, selectProList } = this.data;
		const proItem = productArray[index];
		const hasExit = selectProList.some(item => item.id === proItem.id);
		if (hasExit) {
			wx.showToast({
				title: "产品选择重复",
				icon: "none",
			});
			return;
		}
		selectProList.push({
			id: proItem.id,
			num: 0,
			name: proItem.name,
			remain: proItem.remain,
		});
		this.setData({
			selectProList,
      productIndex: 0,
		});
	},
	handleChangeProNum(e) {
		const index = e.currentTarget.dataset.index;
		const value = e.detail;
		this.setData({
			[`selectProList[${index}].num`]: value,
		});
	},
	handleDelSelect(e) {
		const index = e.currentTarget.dataset.index;
		wx.showModal({
			title: "提示",
			content: "是否确认删除该项目？",
			success: ({ confirm }) => {
				if (confirm) {
					const selectProList = this.data.selectProList;
					selectProList.splice(index, 1);
					this.setData({
						selectProList,
					});
				}
			},
		});
	},
});
