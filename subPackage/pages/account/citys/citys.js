import Notify from "@vant/weapp/notify/notify";

const app = getApp();
const { globalData, cityData, utils } = app;

Page({
	data: {
		multiIndex: [0, 0],
		multiArray: [
			cityData.provinceArray,
			[
				{
					regid: "52",
					parid: "2",
					regname: "北京市",
				},
			],
		],

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

	addCity() {
		const { multiIndex, multiArray, provinceList } = this.data;
		const selectedProvince = multiArray[0][multiIndex[0]];
		const selectedCity = multiArray[1][multiIndex[1]];
		// 判断 添加的省份是已经存在
		const selectedProIndex = provinceList.findIndex(item => String(item.regid) == String(selectedProvince.regid));
		// 判断 添加的城市是已经存在
		if (selectedProIndex > -1) {
			const selectedCityIndex = provinceList[selectedProIndex].cityList.findIndex(
				item => String(item.regid) == String(selectedCity.regid)
			);
			if (selectedProIndex > -1) {
				Notify({
					type: "danger",
					message: "该城市已经存在，无需再次添加！",
				});
				return;
			}
		}
		utils.request(
			{
				// TODO: url 和 data 等待调整
				url: `city/add`,
				data: {
					province_id: selectedProvince.regid,
					city_id: selectedCity.regid,
				},
				method: "POST",
				success: res => {
					wx.showToast({
						title: "添加成功",
						icon: "none",
					});
					// 添加的省份已经存在，只是添加新的城市，则只需要更新该省份下的城市数据即可
					if (selectedProIndex > -1) {
						const selectedPro = provinceList[selectedProIndex];
						provinceList[selectedProIndex] = {
							...selectedPro,
							cityList: [...selectedPro.cityList, {
								regname: selectedCity.regname,
								regid: selectedCity.regid,
								// 初始化 count = 0
								count: 0,
								// 新添加的城市，shopList 为 []
								shopList: [],
							}],
						};
						this.setData({
							provinceList,
						}, () => {
							// 更新 provinceList
							app.globalData.provinceList = this.data.provinceList;
						})
					} else {
						// 添加的省份不存在，则需要更新省份数据
						this.setData({
							provinceList: [
								...provinceList,
								{
									regname: selectedProvince.regname,
									regid: selectedProvince.regid,
									// 初始化该省的 count = 0
									count: 0,
									cityList: [
										{
											regname: selectedCity.regname,
											regid: selectedCity.regid,
											// 初始化该市的 count = 0
											count: 0,
											shopList: [],
										},
									],
								},
							],
						}, () => {
							// 更新 provinceList
							app.globalData.provinceList = this.data.provinceList;
						});
					}
				},
				isShowLoading: true,
			},
			true
		);
	},
	bindMultiPickerChange(ev) {
		const multiIndex = ev.detail.value;
		this.setData({
			multiIndex,
		}, () => {
			this.addCity();
		});
	},
	bindMultiPickerColumnChange(ev) {
		const { column, value } = ev.detail;
		switch (column) {
			case 0:
				// 匹配选择的省份对应的城市
				const citys = cityData.cityArray.filter(city => {
					return city.parid === cityData.provinceArray[value].regid;
				});
				this.setData({
					"multiArray[1]": citys,
					multiIndex: [value, 0],
				});
		}
	},
	jumpAccountManagement(ev) {
		const { index } = ev.currentTarget.dataset;
		const cityId = this.data.cityList[index].regid;

		wx.navigateTo({
			url: `/subPackage/pages/account/manage/manage?cityId=${cityId}`,
		});
	},
});
