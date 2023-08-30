const app = getApp();
const { globalData, utils, cityData } = app;

Page({
	data: {
		provinceIndex: 0,
		provinceList: [],
		cityList: [],
	},
	onShow() {
		const provinceList = cityData.map(item => {
			const findProvince = (globalData.provinceList || []).find(x => x.regid == item.regid);
			const count = (findProvince?.cityList || []).reduce((sum, city) => {
				return sum + (city?.shopList || []).length;
			}, 0);
			const cityList = item.cityList.map(city => {
				if (findProvince) {
					return (findProvince.cityList).find(x => x.regid == city.regid) || city;
				}
				return city;
			});
			return {
				...item,
				cityList,
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
			count: (city?.shopList || []).length,
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
