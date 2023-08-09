const app = getApp();
const { utils, globalData } = app;

Page({
	data: {
		id: "",
		hasSizeInit: false,
		sizeList: [
			{
				name: "脐上",
				size: "",
				originSize: "",
				flag: "size_js",
			},
			{
				name: "脐中",
				size: "",
				originSize: "",
				flag: "size_jz",
			},
			{
				name: "脐下",
				size: "",
				originSize: "",
				flag: "size_jx",
			},
			{
				name: "左臂",
				size: "",
				originSize: "",
				flag: "size_zb",
			},
			{
				name: "右臂",
				size: "",
				originSize: "",
				flag: "size_yb",
			},
			{
				name: "左大腿",
				size: "",
				originSize: "",
				flag: "size_zdt",
			},
			{
				name: "左小腿",
				size: "",
				originSize: "",
				flag: "size_zxt",
			},
			{
				name: "右大腿",
				size: "",
				originSize: "",
				flag: "size_ydt",
			},
			{
				name: "右小腿",
				size: "",
				originSize: "",
				flag: "size_yxt",
			},
		],
		historySizeList: [],
		isShowHistorySize: false,
	},
	onLoad(opts) {
		this.setData({
			id: opts?.customerId,
		}, () => {
			this.getHistoryList();
		})
	},
	getHistoryList() {
		const { id, hasSizeInit, sizeList } = this.data;
		utils.request(
			{
				url: `member/size-history`,
				data: {
					shop_id: globalData.storeInfo.id,
					customer_id: id,
				},
				method: "GET",
				success: (res = []) => {
					const historySizeList = res.map(item => {
						return {
							id: item?.id,
							createTime: item?.ymd,
							list: Object.keys(item?.config).map(key => {
								const { current, init, result } = item?.config[key];
								const index = sizeList.findIndex(item => item.flag === key);
								if (!hasSizeInit) {
									sizeList[index] = {
										...sizeList[index],
										originSize: init,
									};
								}
								return {
									size: current,
									originSize: init,
									diffSize: Number(init) >=  Number(current) ? result : `-${result}`,
									name: sizeList[index]?.name,
								};
							}),
						};
					});
					this.setData({
						historySizeList,
						hasSizeInit: true,
						sizeList,
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
	handleChangeSize(t) {
		const value = t.detail.value;
		const index = t.currentTarget.dataset.index;
		const sizeList = this.data.sizeList;
		sizeList[index].size = value;
		this.setData({
			sizeList,
		});
	},
	// 保存修改
	handleSave() {
		const { id, sizeList } = this.data;
		utils.request(
			{
				url: "member/size",
				data: {
					shop_id: globalData.storeInfo.id,
					customer_id: id,
					data: sizeList.reduce((size, item) => {
						size[item.flag] = item.size;
						return size;
					}, {}),
				},
				method: "POST",
				success: () => {
					this.getHistoryList();
					wx.showToast({
						title: "修改成功",
						icon: "none",
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
	showHistorySize() {
		if (!this.data.historySizeList.length) return;
		this.setData({
			isShowHistorySize: true,
		});
	},
	onCloseHistorySize() {
		this.setData({
			isShowHistorySize: false,
		});
	},
	deleteHistorySize(t) {
		var item = t.currentTarget.dataset.item;
		wx.showModal({
			title: "提示",
			content: "是否确认删除该历史尺寸？",
			success: ({ confirm }) => {
				if (confirm) {
					utils.request(
						{
							url: "member/size-del",
							data: {
								shop_id: globalData.storeInfo.id,
								customer_id: this.data.id,
								id: item.id,
							},
							method: "POST",
							success: () => {
								this.getHistoryList();
								wx.showToast({
									title: "删除成功",
									icon: "none",
								});
							},
							isShowLoading: true,
						},
						true
					);
				}
			},
		});
	},
});
