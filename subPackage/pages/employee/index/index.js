const app = getApp();
const { utils, globalData } = app;

Page({
	data: {
		isShowCalendar: false,
		// 开始时间
		startDate: `${utils.formatTime(new Date(), "YYYY-MM")}-01`,
		 // 结束时间
		endDate: utils.formatTime(new Date(), "YYYY-MM-DD"),
		listData: [],
	},
	onLoad() {
		this.getListData();
	},
	getListData() {
		// 店铺id
		const { id } = globalData.storeInfo;
		const { startDate, endDate } = this.data;
		utils.request(
			{
				url: `project/tongji`,
				data: {
					shop_id: id,
					date_start: startDate,
					date_end: endDate,
				},
				method: "GET",
				success: res => {
					let list = res;
					if (!Array.isArray(res)) {
						list = Object.keys(res || {}).map(name => ({
							userName: name,
							serviceList: res[name].map(item => ({
								name: item.body,
								count: item.total,
							}))
						}));
					}
					this.setData({
						listData: list,
					});
				},
			},
			true
		);
	},
	showCalendar() {
		this.setData({
			isShowCalendar: true,
		});
	},
	hideCalendar() {
		this.setData({
			isShowCalendar: false,
		});
	},
	handleCalendarChange(e) {
		const nowTime = utils.formatTime(new Date(), "YYYY-MM-DD");
		// 边界处理，防止页面报错
		const [start, end] = (Array.isArray(e.detail) ? e.detail : [nowTime, nowTime]).map(time => time.replace(/\s.*/, ""));
		this.setData({
			startDate: start,
			endDate: end,
		});
		this.getListData();
		this.hideCalendar();
	},
});
