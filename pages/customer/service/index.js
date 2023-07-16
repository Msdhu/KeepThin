const app = getApp();
const { utils, globalData, ROLES } = app;
const throttle = utils.throttle;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		customerId: "",
		date: utils.formatTime(new Date(), "YYYY-MM-DD"),
		isShowCalendar: false,
		serviceList: [], // 服务列表
		consumerwarn: {},
		warnTime: "", // 服务提醒时间
		steps: [
			{
				text: "",
				desc: "选择部位",
			},
			{
				text: "",
				desc: "选择人员",
			},
			{
				text: "",
				desc: "选择项目",
			},
		],
		active: 0, // 当前添加项目的步骤
		partList: [], // 部位列表
		starffList: [], // 人员列表
		proList: [], // 项目列表
		addStepsValMap: {}, // 天降项目每项步骤的值
		isShowAddPop: false,
		isShowHistoryPop: false,
		historyList: [], // 历史服务列表
	},

	noop() {},
	onLoad(opts) {
		this.data.customerId = opts.customerId;
		this.getServiceList();
		this.getPartList();
		this.getStaffList();
		this.getProList();
		this.getServiceHistory();
	},
	// 获取服务列表
	getServiceList() {
		this.setData({
			serviceList: [
				{
					id: "1",
					name: "背部",
					products: [
						{
							id: "2",
							productName: "卡机嘛",
						},
						{
							id: "2",
							productName: "阿鲁",
						},
						{
							id: "2",
							productName: "教练",
						},
					],
					userName: "二凯",
				},
				{
					id: "1",
					name: "背部",
					products: [
						{
							id: "2",
							productName: "卡机嘛",
						},
						{
							id: "2",
							productName: "阿鲁",
						},
						{
							id: "2",
							productName: "教练",
						},
					],
					userName: "二凯",
				},
				{
					id: "1",
					name: "背部",
					products: [
						{
							id: "2",
							productName: "卡机嘛",
						},
						{
							id: "2",
							productName: "阿鲁",
						},
						{
							id: "2",
							productName: "教练",
						},
					],
					userName: "二凯",
				},
			],
		});
	},
	getPartList() {
		this.setData({
			partList: [
				{
					id: "1",
					name: "背部",
				},
				{
					id: "2",
					name: "腹部",
				},
			],
		});
	},
	getStaffList() {
		this.setData({
			starffList: [
				{
					id: "1",
					name: "小龙",
				},
				{
					id: "2",
					name: "老六",
				},
			],
		});
	},
	getProList() {
		this.setData({
			proList: [
				{
					id: "1",
					name: "马杀鸡",
				},
				{
					id: "2",
					name: "乱锤",
				},
			],
		});
	},
	// 删除服务
	deleteItem(t) {
		var item = t.currentTarget.dataset.item;
		wx.showModal({
			title: "提示",
			content: "是否确认删除该项目？",
			success: ({ confirm }) => {
				if (confirm) {
				}
			},
		});
	},
	handleShowAddPop() {
		this.setData({
			isShowAddPop: true,
		});
	},
	handleHideAddPop() {
		this.setData({
			active: 0,
			addStepsValMap: {},
			isShowAddPop: false,
		});
	},
	// 改变添加服务的步骤
	changeStep(t) {
		this.setData({
			active: t.detail,
		});
	},
	changeAddStepVal(value) {
		console.log(value);
		const data = this.data;
		const { active } = data;
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
		this.handleHideAddPop();
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
		});
		this.getServiceList();
	},
	checkRemain() {
		wx.showToast({
			icon: "none",
			title: "该顾客还未购买产品!",
		});
	},

	handleChangeWanTime(e) {
		const value = e.detail;
	},
	handleCacelWarn() {},
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
	getServiceHistory() {
		this.setData({
			historyList: [
				{
					id: "1",
					time: "2023-07-02",
					name: "背部",
					products: [
						{
							id: "2",
							productName: "卡机嘛",
						},
						{
							id: "2",
							productName: "阿鲁",
						},
						{
							id: "2",
							productName: "教练",
						},
					],
					userName: "二凯",
				},
				{
					id: "1",
					time: "2023-07-02",
					name: "背部",
					products: [
						{
							id: "2",
							productName: "卡机嘛",
						},
						{
							id: "2",
							productName: "阿鲁",
						},
						{
							id: "2",
							productName: "教练",
						},
					],
					userName: "二凯",
				},
				{
					id: "1",
					time: "2023-07-02",
					name: "背部",
					products: [
						{
							id: "2",
							productName: "卡机嘛",
						},
						{
							id: "2",
							productName: "阿鲁",
						},
						{
							id: "2",
							productName: "教练",
						},
					],
					userName: "二凯",
				},
			],
		});
	},
});
