const app = getApp();
const { utils, globalData, ROLES } = app;

const menuList = [
	{
		color: "#2C9C58",
		title: "新客录入",
		img: "/assets/img/xinkeluru.png",
		url: "/subPackage/pages/customer/new/new",
		needStore: true,
		roles: [ROLES.manager, ROLES.admin, ROLES.employee, ROLES.marketing],
	},
	{
		color: "#A27954",
		title: "店铺管理",
		img: "/assets/img/dianpuguanli.png",
		url: "/subPackage/pages/store/manage/manage",
		needStore: true,
		roles: [ROLES.manager, ROLES.admin, ROLES.employee, ROLES.marketing],
	},
	{
		color: "#2CABF5",
		title: "库存管理",
		img: "/assets/img/kucunguanli.png",
		url: "/subPackage/pages/stock/stock",
		needStore: true,
		roles: [ROLES.manager, ROLES.admin, ROLES.marketing],
	},
	{
		color: "#A27954",
		title: "员工统计",
		img: "/assets/img/yuangogntongji.png",
		url: "/subPackage/pages/employee/index/index",
		needStore: true,
		roles: [ROLES.manager, ROLES.admin, ROLES.marketing],
	},
	{
		color: "#CC942C",
		title: "店铺设置",
		img: "/assets/img/dianpushezhi.png",
		url: "/subPackage/pages/store/setting/setting",
		needStore: true,
		roles: [ROLES.manager, ROLES.admin, ROLES.employee, ROLES.marketing],
	},
	{
		color: "#DA7A7C",
		title: "账号管理",
		img: "/assets/img/zhanghaoguanli.png",
		url: "/subPackage/pages/account/manage/manage",
		needStore: true,
		roles: [ROLES.manager, ROLES.admin, ROLES.marketing],
	},
];

Page({
	data: {
		ROLES,
		showMenuList: menuList, // 显示的菜单
		isStorePopShow: false,
		isAdmin: false,
		storeList: [],
		activeStoreIndex: -1,
		storeInfo: null,
		provinceList: [],
		cityList: [],
		cityInfo: null,
		selectProvince: {
			provinceId: 2,
		},
		selectCity: {
			cityId: 0,
		},
		showPhone: "", // 展示的手机
		isShowPhone: true, // 是否显示全手机
		navigationColor: "#fff", // 导航文字颜色
		isShowCityPop: false,
	},
	onLoad() {
		const userInfo = globalData.userInfo;
		const roleType = userInfo.roleType;
		this.setData({
			userInfo,
			checkIndex: "false",
			showPhone: userInfo.phone,
			storeInfo: globalData.storeInfo,
			cityInfo: globalData.cityInfo,
			offsetTop: globalData.marginTop,
			isAdmin: roleType === ROLES.admin,
			showMenuList: menuList.filter((item) => item.roles.includes(roleType)),
		});
		this.getStoreList();
		this.getProvinceList();
		this.getCityList();
	},
	getProvinceList() {
		this.setData({
			provinceList: app.cityData.provinceArray,
		});
	},
	getCityList() {
		const selectProvince = this.data.selectProvince;
		this.setData({
			cityList: app.cityData.cityArray,
		});
	},
	getStoreList(t) {
		this.setData({
			storeList: [
				{
					id: 1,
					name: "阳泉 康达店",
					isRead: true,
				},
				{
					id: 2,
					name: "测试店铺",
					isRead: true,
				},
				{
					id: 3,
					name: "测试店铺2",
					isRead: false,
				},
				{
					id: 4,
					name: "测试店铺3",
					isRead: true,
				},
			],
		});
	},

	// 事件
	handleChangePhoneShow() {
		const isShowPhone = !this.data.isShowPhone;
		const phone = this.data.userInfo.phone;
		const showPhone = isShowPhone
			? phone
			: `${phone.slice(0, 3)}****${phone.slice(-4)}`;
		this.setData({
			isShowPhone,
			showPhone,
		});
	},
	// 跳转页面
	handleGoto(e) {
		const index = e.currentTarget.dataset.index;
		const menuItem = this.data.showMenuList[index];
		const { url, needStore } = menuItem;
		console.log(menuItem);
		const storeInfo = this.data.storeInfo;
		if (storeInfo || !needStore) {
			wx.navigateTo({
				url,
			});
		} else {
			wx.showToast({
				icon: "none",
				title: "请先选择店铺",
			});
		}
	},
	// 开始选择店铺
	switchStore() {
		this.setData({
			isStorePopShow: true,
			navigationColor: "#515365",
		});
	},
	// 关闭选择店铺
	closeStorePop() {
		this.setData({
			isStorePopShow: false,
			navigationColor: "#fff",
		});
	},
	checkStore(e) {
		const storeIndex = +e.currentTarget.dataset.index;
		const storeInfo = this.data.storeList[storeIndex];
		if (this.data.activeCityIndex !== storeIndex) {
			this.setData({
				storeInfo,
			});
			globalData.storeInfo = storeInfo;
		}
		this.closeStorePop();
	},

	showCityPop() {
		this.setData({
			isShowCityPop: true,
		});
	},
	hideCityPop() {
		this.setData({
			isShowCityPop: false,
		});
	},

	onClickProvince(e) {
		this.setData(
			{
				selectProvince: e.currentTarget.dataset.item,
				selectCity: {
					cityId: 0,
				},
			},
			() => {
				this.getCityList();
			}
		);
	},
	onClickCity(e) {
		this.setData({
			selectCity: e.currentTarget.dataset.item,
		});
	},
	handleSaveSelectCity() {
		const selectedCity = this.data.selectCity;
		this.setData({
			cityInfo: selectedCity,
		});
		this.getStoreList();
		this.hideCityPop();
	},
});
