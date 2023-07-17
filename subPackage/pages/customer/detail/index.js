import * as echarts from "../../../components/ec-canvas/echarts";
const app = getApp();
const { utils, globalData, ROLES } = app;

const curDateTxt = utils.formatTime(new Date(), "YYYY-MM-DD");

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		id: "",

		offsetTop: globalData.marginTop,
		userInfo: globalData.userInfo,
		navColor: "", // 导航颜色
		isShowCurrentWeight: false, // 是否展示当前体重输入框
		currentWeight: "", // 输入的当前体重
		isShowCalendar: false,
		currentDate: curDateTxt, // 当前数据的时间
		activeNames: [], // 折叠面板展开数据
		detailData: null,
		isShowPhone: true, // 是否显示完整手机号
		weightHistory: null, // 历史体重
		warnData: {
			notArrivateStore: false,
			notProjectof3Days: false,
			notProjectof7Days: false,
		},
		chartBar: {},
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(opts) {
		this.data.id = opts.id;
	},
	onShow() {
		this.getDetailData();
		this.getWarnData();
	},

	onPageScroll(e) {
		this.setData({
			navColor: utils.getNavColor(e),
		});
	},
	// 获取用户详情
	getDetailData() {
		this.setData({
			detailData: {
				id: "",
				name: "二凯",
				gender: "1",
				phone: "18155040067",
				standarded: 2, // 减重期 1:匀减期 2：'已达标 3：速减期
				isConsolidationPeriod: "", // 是否转入巩固期
				currentWeight: "123", // 今日体重
				todayLossedWeight: 131, // 今日减重
				realLossedWeight: 11, // 实际减重
				totalLossedWeight: 31, // 累计体重
				regiseterCount: 11, // 累积到店
				unLossWeight: 21, // 未减斤数
				lowestWeight: 111, // 最低体重
				originWeight: 161, // 初始体重
				standardWeight: 17, // 标准体重
				loseWeight: 39, // 应减斤数
			},
			weightHistory: [
				{
					id: 1,
					name: "06-01",
					value: 100,
				},
				{
					id: 1,
					name: "06-02",
					value: 200,
				},
				{
					id: 1,
					name: "06-03",
					value: 0,
				},
				{
					id: 1,
					name: "06-05",
					value: 1000,
				},
			],
		});
	},
	// 获取警告信息
	getWarnData() {
		this.setData({
			warnData: {
				notArrivateStore: true,
				notProjectof3Days: false,
				notProjectof7Days: false,
			},
		});
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
		});
	},
	// 保存今日体重
	saveCurrentWeight() {
		this.hideCurrentWeight();
	},
	// 跳转页面
	jumpUrl(e) {
		const url = e.currentTarget.dataset.url;
		const detailData = this.data.detailData;
		if (url.indexOf("?") > -1) {
			wx.navigateTo({
				url,
			});
		} else {
			wx.navigateTo({
				url: `${url}?registerId=${detailData.registerId}&customerId=${detailData.id}`,
			});
		}
	},
	// 改变折叠面板状态
	onChangeCollapse(e) {
		const activeNames = e.detail;
		this.setData(
			{
				activeNames,
			},
			() => {
				if (activeNames.length && this.data.weightHistory.length) {
					this.getChart();
				}
			}
		);
	},
	getChart() {
		console.log("初始化图表");
		this.setData({
			"chartBar.onInit": this.initChart,
		});
	},
	initChart(canvas, width, height, dpr) {
		const chart = echarts.init(canvas, null, {
			width: width,
			height: height,
			dpr,
		});
		canvas.setChart(chart);
		const weightHistory = this.data.weightHistory;
		console.log(weightHistory, canvas, width, height)
		var option = {
			grid: {
				containLabel: true,
			},
			tooltip: {
				show: true,
				trigger: "axis",
			},
			xAxis: {
				type: "category",
				boundaryGap: false,
				data: weightHistory.map((item) => item.name),
				// show: false
			},
			yAxis: {
				x: "center",
				type: "value",
				splitLine: {
					lineStyle: {
						type: "dashed",
					},
				},
				// show: false
			},
			series: [
				{
					type: "line",
					smooth: true,
					data: weightHistory.map((item) => item.value),
				},
			],
		};
		chart.setOption(option);
		return chart;
	},
	// 删除顾客信息
	handleDelUser() {
		wx.showModal({
			title: "提示",
			content: "是否确认删除该顾客信息？",
			success: (a) => {
				if (a.confirm) {
					wx.showToast({
						icon: "none",
						title: "删除成功",
					});
					setTimeout(() => {
						wx.navigateBack({
							delta: 1,
						});
					}, 1000);
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
		});
	},
	onConfirmCalendar(e) {
		var value = e.detail.split(" ")[0];
		this.setData(
			{
				currentDate: value,
				isShowCalendar: false,
			},
			() => {
				this.getDetailData();
			}
		);
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
