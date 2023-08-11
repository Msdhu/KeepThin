import Notify from "@vant/weapp/notify/notify";

const app = getApp();
const { utils, globalData } = app;

Page({
	data: {
		// 顾客id
		id: "",
		date: utils.formatTime(new Date(), "YYYY-MM-DD"),
		isShowCalendar: false,
		steps: [{
			text: "",
			desc: "选择部位",
		}, {
			text: "",
			desc: "选择人员",
		}, {
			text: "",
			desc: "选择项目",
		}],
		// 服务列表
		serviceList: [],
		// 当前添加项目的步骤
		active: 0,
		// 部位列表
		partList: [],
		// 人员列表
		starffList: [],
		// 项目列表
		proList: [],
		// 添加项目每项步骤的值
		addStepsValMap: [],
		isShowAddPop: false,
		isShowHistoryPop: false,
		// 历史服务列表
		historyList: [],
	},
	onLoad(opts) {
		this.setData({
			id: opts.customerId,
		}, () => {
			this.getServiceHistory();
			this.getServiceConfig();
		});
	},
	getServiceHistory() {
		const { id } = this.data;
		utils.request(
			{
				url: `project/history`,
				data: {
					// 店铺id
					shop_id: globalData.storeInfo.id,
					customer_id: id,
				},
				method: "GET",
				success: res => {
					const historyList = (res || []).map(item => ({
						id: item?.id,
						time: item?.ymd,
						userName: item?.member,
						name: item?.body,
						products: [{
							productName: item?.good_name,
						}],
					}));
					this.setData({
						historyList,
					}, () => {
						this.getServiceList();
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
	getServiceList() {
		const { date, historyList } = this.data;
		this.setData({
			serviceList: historyList.filter(item => item.time === date),
		});
	},
	getServiceConfig() {
		const { id } = this.data;
		utils.request(
			{
				url: `project/config`,
				data: {
					// 店铺id
					shop_id: globalData.storeInfo.id,
					customer_id: id,
				},
				method: "GET",
				success: res => {
					const { shop_bodys = [], shop_members = [], goods = {} } = res;
					this.setData({
						partList: shop_bodys.map(item => ({ name: item.name })),
						starffList: shop_members.map(item => ({ name: item.name })),
						proList: Object.keys(goods).map(key => ({ id: key, name: goods[key] }))
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
	deleteItem(ev) {
		const { item } = ev.currentTarget.dataset;
		wx.showModal({
			title: "提示",
			content: "是否确认删除该项目？",
			success: ({ confirm }) => {
				if (confirm) {
					utils.request(
						{
							url: `project/del`,
							data: {
								shop_id: globalData.storeInfo.id,
								customer_id: this.data.id,
								id: item?.id,
							},
							method: "POST",
							success: res => {
								wx.showToast({
									title: "删除成功",
									icon: "none",
								});
								this.getServiceHistory();
							},
							isShowLoading: true,
						},
						true
					);
				}
			},
		});
	},
	// 改变添加服务的步骤
	changeStep(t) {
		this.setData({
			active: t.detail,
		});
	},
	changeAddStepVal(value) {
		const { active } = this.data;
		const key = `addStepsValMap[${active}]`;
		this.setData({
			[key]: value,
		});
		if (active < 2) {
			setTimeout(() => {
				this.setData({
					active: active + 1,
				});
			}, 500);
		}
	},
	onChangeRadio(e) {
		this.changeAddStepVal(e.detail);
	},
	onClickRadio(t) {
		this.changeAddStepVal(t.currentTarget.dataset.index);
	},
	handleSaveAdd() {
		const { partList, starffList, proList, addStepsValMap, id, date } = this.data;
		const body = partList[addStepsValMap[0]]?.name;
		const member = starffList[addStepsValMap[1]]?.name;
		const goodId = proList[addStepsValMap[2]]?.id;
		if (addStepsValMap.length !== 3 || !(body && member && goodId)) {
			Notify({
				type: "danger",
				message: "请完善所有步骤！",
			});
			return;
		}
		utils.request(
			{
				url: `project/add`,
				data: {
					shop_id: globalData.storeInfo.id,
					customer_id: id,
					body,
					member,
					good_id: goodId,
					ymd: date,
				},
				method: "POST",
				success: res => {
					wx.showToast({
						title: "新增成功",
						icon: "none",
					});
					this.getServiceHistory();
					this.handleHideAddPop();
				},
				isShowLoading: true,
			},
			true
		);
	},
	handleHideAddPop() {
		this.setData({
			active: 0,
			addStepsValMap: [],
			isShowAddPop: false,
		});
	},
	handleShowAddPop() {
		if (!this.data.proList.length) {
			wx.showToast({
				title: "该顾客还未购买产品!",
				icon: "none",
			});
			return;
		}
		this.setData({
			isShowAddPop: true,
		});
	},

	showCalendar() {
		this.setData({
			isShowCalendar: true,
		});
	},
	handleDateChange(e) {
		this.setData({
			date: e.detail.split(" ")[0],
			isShowCalendar: false,
		}, () => {
			this.getServiceList();
		});
	},
	showHistoryPop() {
		this.setData({
			isShowHistoryPop: true,
		});
	},
	closeHistoryPop() {
		this.setData({
			isShowHistoryPop: false,
		});
	},
});
