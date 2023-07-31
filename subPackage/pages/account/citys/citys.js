const app = getApp();
const { utils, globalData, ROLES } = app;

Page({
	data: {
		multiIndex: [0, 0],
		multiArray: [
			[
				{
					regid: "52",
					parid: "2",
					regname: "北京市",
					regtype: "2",
					ageid: "0",
				},
			],
		],
		defaultCity: {},
		provinceIndex: 0,
		provinceArray: [],
		cityList: [],
	},
	onLoad: function (t) {
		this.setData({});
	},
	onReady: function () {},
	onShow: function () {
		this.getCity();
		this.getDefaultCity();
	},
	getDefaultCity: function () {
		this.setData({
			cityList: [],
		});
	},
	getCity: function () {
		this.setData({
			defaultCity: {},
		});
	},
	bindProvinceIdChange: function (t) {},
	addCity: function () {},
	bindMultiPickerChange: function (t) {},
	bindMultiPickerColumnChange: function (t) {},
	jumpAccountManagement: function (t) {
		wx.navigateTo({
			url: `/subPackage/pages/account/manage/manage?cityId=${this.data.defaultCity.provinceId}&provinceId=${t.currentTarget.dataset.params.cityId}`,
		});
	},
});
