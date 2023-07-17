const app = getApp();
const { utils, globalData, ROLES } = app;
const nowDateTxt = utils.formatTime(new Date(), "YYYY-MM-DD");

Page({
	data: {
		isShowCalendar: !1,
		startDate: utils.formatTime(
			new Date(Date.now() - 7 * 24 * 3600000),
			"YYYY-MM-DD"
		), // 开始时间
		endDate: utils.formatTime(new Date(), "YYYY-MM-DD"), // 结束时间
		listData: [],
	},
	onLoad() {
		this.getListData();
	},
	getListData() {
		this.setData({
			listData: [
				{
					id: 1,
					userName: "小二",
					serviceList: [
						{
							name: "小腿",
							count: 1,
						},
						{
							name: "大腿",
							count: 1,
						},
						{
							name: "面部",
							count: 1,
						},
					],
				},
				{
					id: 1,
					userName: "小四",
					serviceList: [
						{
							name: "小腿",
							count: 1,
						},
					],
				},
			],
		});
	},
	showCalendar() {
		this.setData({
			isShowCalendar: true,
		});
	},
	showCalendar() {
		this.setData({
			isShowCalendar: false,
		});
	},
	handleCalendarChange(e) {
		const value = e.detail;
		console.log(e);
		if (this.data.isExport) {
		} else {
			this.setData({
				startDate: value[0].replace(/\s.*/, ""),
				endDate: value[1].replace(/\s.*/, ""),
			});
			this.getListData();
		}
		this.hideCalendar();
	},
});
