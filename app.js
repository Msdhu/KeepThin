// app.js
import { ROLES } from "/utils/constant";
const utils = require("/utils/util");
const cityData = require("/utils/cityData");
App({
	onLaunch() {
		const globalData = this.globalData;
		wx.getSystemInfo({
			success: (sysInfo) => {
				console.log("sysinfo:", sysInfo);
				const ratio = 750 / sysInfo.windowWidth;
				const clientInfo = wx.getMenuButtonBoundingClientRect();
				globalData.systemInfo = sysInfo;
				globalData.marginTop = (clientInfo.top + clientInfo.height) * ratio;
			},
			fail(err) {
				console.log(err);
			},
		});
	},
	utils,
	cityData,
	ROLES,
	globalData: {
		systemInfo: {},
		
		userInfo: {
			roleType: ROLES.admin,
			phone: "112341234",
			name: "凯多",
		},
		storeInfo: {
			id: 1,
			name: "阳泉 康达店",
			isRead: true,
		},
		cityInfo: {
			id: "",
			name: "山西省 阳泉市",
		},
		marginTop: 0,
	},
});
