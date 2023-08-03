import Notify from "@vant/weapp/notify/notify";

const app = getApp();
const { globalData, utils } = app;

Page({
	data: {
		provinceIndex: 0,
		provinceList: [],
		cityList: [],
	},
	onShow() {
		const provinceList = (globalData.provinceList || []).map(item => {
			const count = (item.cityList || []).reduce((sum, city) => {
				return sum + (city.shopList || []).length;
			}, 0);
			return {
				...item,
				count,
			};
		});
		this.setData({
			provinceList,
			cityList: this.getCityList(provinceList, this.data.provinceIndex),
		});
	},
	bindProvinceIdChange(ev) {
		const index = ev.detail.value;
		this.setData({
			provinceIndex: index,
			cityList: this.getCityList(this.data.provinceList, index),
		});
	},
	getCityList(list, index) {
		return list[index].cityList.map(city => ({
			...city,
			count: (city.shopList || []).length,
		}));
	},

	jumpAccountManagement(ev) {
		const { index } = ev.currentTarget.dataset;
		const cityId = this.data.cityList[index].regid;
		const cityName = this.data.cityList[index].regname;

		wx.navigateTo({
			url: `/subPackage/pages/account/manage/manage?cityId=${cityId}&cityName=${cityName}`,
		});
	},
});
