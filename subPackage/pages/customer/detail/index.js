const WxCharts = require('../../../wxCharts.js');
const app = getApp();
const { utils, globalData } = app;

const curDateTxt = utils.formatTime(new Date(), "YYYY-MM-DD");
let wxChart = null;

Page({
	data: {
		id: "",
		offsetTop: globalData.marginTop,
		// 导航颜色
		navColor: "",
		// 是否展示当前体重输入框
		isShowCurrentWeight: false,
		// 输入的当前体重
		currentWeight: "",
		isShowCalendar: false,
		// 当前数据的时间
		currentDate: curDateTxt,
		// 折叠面板展开数据
		activeNames: [],
		detailData: {},
		// 是否显示完整手机号
		isShowPhone: true,
		// 历史体重
		weightHistory: [],
		chartBar: {},

		// 获取警告信息 TODO: 后续确认该字段
		warnData: {
			notArrivateStore: false,
			notProjectof3Days: false,
			notProjectof7Days: false,
		},
	},

	onLoad(opts) {
		this.setData({
			id: opts?.id,
		});
	},
	onShow() {
		this.getDetailData();
		this.getWeightHistory();
	},
	onPageScroll(e) {
		this.setData({
			navColor: utils.getNavColor(e),
		});
	},
	// 获取用户详情
	getDetailData() {
		const { currentDate, id } = this.data;
		utils.request(
			{
				url: `member/tongji`,
				data: {
					// 店铺id
					shop_id: globalData.storeInfo.id,
					customer_id: id,
					ymd: currentDate,
				},
				method: "GET",
				success: res => {
					const customerInfo = wx.getStorageSync('customerInfo');
					this.setData({
						currentWeight: res.current_weight,
						detailData: {
							id: customerInfo.id,
							name: customerInfo.name,
							gender: customerInfo.gender,
							phone: customerInfo.phone,
							// TODO: 后续确认该字段
							standarded: 3, // 减重期  1: 匀减期 2： 已达标 3: 速减期
							// 是否转入巩固期
							isConsolidationPeriod: "",
							// 今日体重
							currentWeight: res.current_weight,
							// 今日减重
							todayLossedWeight: res.today_weight_reduce || 0,
							// 实际减重
							realLossedWeight: (((res.real_weight_reduce || 0) * 10000 + 1) / 10000).toFixed(1),
							// 累计体重
							totalLossedWeight: res.total_weight_reduce || 0,
							// 累积到店
							regiseterCount: res.arrive_count || 0,
							// 未减斤数
							unLossWeight: (((res.no_weight_reduce || 0) * 10000 + 1) / 10000).toFixed(1),
							// 最低体重
							lowestWeight: res.min_weight_reduce || 0,
							// 初始体重
							originWeight: res.weight_init || 0,
							// 标准体重
							standardWeight: res.weight_normal || 0,
							// 应减斤数
							loseWeight: res.weight_reduce || 0,
						},
					});
				},
				isShowLoading: true,
			},
			true
		);
	},
	getWeightHistory() {
		const { id } = this.data;
		utils.request(
			{
				url: `member/weight-history`,
				data: {
					// 店铺id
					shop_id: globalData.storeInfo.id,
					customer_id: id,
				},
				method: "GET",
				success: res => {
					const x_data = [], y_data = [];
					res.forEach(item => {
						x_data.unshift(item.date.slice(5))
						y_data.unshift(item.weight);
					});
					const min = Math.min.apply(Math, y_data), max = Math.max.apply(Math, y_data);
					this.setData({
						weightHistory: res || [],
						chartsObj: {
							chartTit: "历史体重",
							x_data,
							y_data,
							min,
							max,
						},
					}, () => {
						this.OnWxChart(x_data, y_data, "历史体重", min, max)
					});
				},
			},
			true
		);
	},
	// 显示今日体重弹窗
	showCurrentWeight() {
		this.setData({
			isShowCurrentWeight: true,
		});
	},
	// 关闭今日体重弹窗
	hideCurrentWeight() {
		this.setData({
			isShowCurrentWeight: false,
			currentWeight: "",
		}, () => {
			if (this.data.weightHistory.length) {
				const { x_data, y_data, chartTit, min, max } = this.data.chartsObj
				this.OnWxChart(x_data, y_data, chartTit, min, max);
			}
		});
	},
	// 保存今日体重
	saveCurrentWeight() {
		const { currentDate, id, currentWeight } = this.data;
		utils.request(
			{
				url: "member/weight-update",
				data: {
					// 店铺id
					shop_id: globalData.storeInfo.id,
					customer_id: id,
					ymd: currentDate,
					weight: currentWeight,
				},
				method: "POST",
				success: () => {
					this.getDetailData();
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
		this.hideCurrentWeight();
	},
	// 跳转页面
	jumpUrl(e) {
		const url = e.currentTarget.dataset.url;
		const	{ detailData } = this.data;
		if (url.indexOf("?") > -1) {
			wx.navigateTo({
				url,
			});
		} else {
			wx.navigateTo({
				url: `${url}?customerId=${detailData.id}`,
			});
		}
	},

	// 改变折叠面板状态
	onChangeCollapse(e) {
		const activeNames = e.detail;
		this.setData({
			activeNames,
		}, () => {
			if (activeNames.length && this.data.weightHistory.length) {
				const { x_data, y_data, chartTit, min, max } = this.data.chartsObj
				this.OnWxChart(x_data, y_data, chartTit, min, max);
			}
		});
	},
	OnWxChart(x_data, y_data, chartTit, min, max) {
		const systemInfo = wx.getSystemInfoSync();
		const width = systemInfo.windowWidth / 750 * 690 - 20, height = systemInfo.windowWidth / 750 * 550 - 100;
		wxChart = new WxCharts({
			canvasId: "lineCanvas",
			type: "line",
			categories: x_data,
			animation: !0,
			legend: !1,
			series: [{
				name: "",
				data: y_data,
				format: (t, a) => {
						return t + "斤";
				}
			}],
			xAxis: {
				disableGrid: !0
			},
			yAxis: {
				title: "",
				format: (t) => {
					return t.toFixed(2);
				},
				max: max + .8,
				min: min - .5,
				gridColor: "#D8D8D8"
			},
			width,
			height,
			dataLabel: !1,
			dataPointShape: !0,
			extra: {
				lineStyle: "curve"
			}
		});
	},
	touchcanvas(t) {
		wxChart.showToolTip(t, {
			format: (t, a) => {
				return a + " " + t.name + ":" + t.data;
			}
		});
	},

	// 删除顾客信息
	handleDelUser() {
		wx.showModal({
			title: "提示",
			content: "是否确认删除该顾客信息？",
			success: (a) => {
				if (a.confirm) {
					const { currentDate, id, currentWeight } = this.data;
					utils.request(
						{
							// TODO: 修改 url
							url: "member/delete",
							data: {
								// 店铺id
								shop_id: globalData.storeInfo.id,
								customer_id: id,
							},
							method: "POST",
							success: () => {
								wx.showToast({
									icon: "none",
									title: "删除成功",
								});
								setTimeout(() => {
									wx.navigateBack({
										delta: 1,
									});
								}, 1000);
							},
							isShowLoading: true,
						},
						true
					);
				}
			},
		});
	},
	showCalendar() {
		this.setData({
			isShowCalendar: true,
		});
	},
	hideCalendar() {
		this.setData({
			isShowCalendar: false,
		}, () => {
			if (this.data.weightHistory.length) {
				const { x_data, y_data, chartTit, min, max } = this.data.chartsObj
				this.OnWxChart(x_data, y_data, chartTit, min, max);
			}
		});
	},
	onConfirmCalendar(e) {
		var value = e.detail.split(" ")[0];
		this.setData({
			currentDate: value,
			isShowCalendar: false,
		}, () => {
			this.getDetailData();
		});
	},
	chageShowPhone() {
		this.setData({
			isShowPhone: !this.data.isShowPhone,
		});
	},
	callPhone(e) {
		const phone = e.currentTarget.dataset.phone;
		wx.showModal({
			title: "提示",
			content: `是否拨打电话-${phone}`,
			success: function ({ confirm }) {
				if (confirm) {
					wx.makePhoneCall({
						phoneNumber: phone,
					});
				}
			},
		});
	},
});
