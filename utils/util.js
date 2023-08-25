const fillNum = n => {
	n = n.toString();
	return n[1] ? n : `0${n}`;
};

const checkLoginToken = (needRedirectToLoginPage = false) => {
	// 获取上次登陆时保存的token
	const token = wx.getStorageSync("loginInfo").token || "";
	// 获取上次登陆时保存的时间戳
	const loginTime = new Date(wx.getStorageSync("loginTime") || new Date().getTime()).getTime();
	const nowTime = new Date().getTime();
	// 判断是否需要登陆: token不存在 || token 过期
	const needLogin = !token || (token && nowTime - loginTime > 24 * 60 * 60 * 1000);

	if (needRedirectToLoginPage && needLogin) {
		wx.redirectTo({
			url: "/pages/login/login",
		});
	}

	return { token, needLogin };
};

const baseUrl = "https://api.xiatianwang.cn";

const utils = {
	formatTime(dt, format = "YYYY-MM-DD hh:mm:ss") {
		const year = dt.getFullYear();
		const month = fillNum(dt.getMonth() + 1);
		const date = fillNum(dt.getDate());
		let hours = fillNum(dt.getHours());
		let minutes = fillNum(dt.getMinutes());
		const seconds = fillNum(dt.getSeconds());
		return format
			.replace(/Y+/, year)
			.replace(/M+/, month)
			.replace(/D+/, date)
			.replace(/h+/, hours)
			.replace(/m+/, minutes)
			.replace(/s+/, seconds);
	},
	throttle(fn, betweenTime = 300) {
		let startTime = 0;
		return function () {
			const nowTime = Date.now();
			if (nowTime - startTime > betweenTime) {
				startTime = nowTime;
				return fn.apply(this, arguments);
			}
		};
	},
	obj2query(obj) {
		return Object.keys(obj)
			.map(key => `${key}=${obj[key]}`)
			.join("&");
	},
	checkPhone(phone) {
		const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
		return reg.test(phone);
	},
	getNavColor(e) {
		return e.scrollTop < 50
			? "rgba(255,255,255,1)"
			: e.scrollTop < 100
			? "rgba(25, 52, 78,.6)"
			: e.scrollTop < 200
			? "rgba(25, 52, 78,.7)"
			: e.scrollTop < 300
			? "rgba(25, 52, 78,.8)"
			: "rgba(0,0,0,1)";
	},
	checkLoginToken: checkLoginToken,
	request: (params = {}, needRedirectToLoginPage = false) => {
		const { token } = checkLoginToken(needRedirectToLoginPage);
		let header = {
			"content-type": "application/json",
		};
		if (token) {
			header = {
				...header,
				SToken: token,
			};
		}
		const { success, isShowLoading = false, ...resParams } = params;
		// 是否展示Loading
		isShowLoading && wx.showLoading();

		wx.request({
			...resParams,
			url: `${baseUrl}/${resParams.url}`,
			header,
			success: res => {
				const { data: realRes } = res;
				const { data: resData, code, msg } = realRes;
				isShowLoading && wx.hideLoading();
				if (code === 100) {
					success(resData);
				} else if (code === 403) {
					// 后端返回 token 过期
					wx.showToast({
						title: msg || "请求失败，请稍后重试",
						icon: "none",
					});
					// 1 秒后 redirectTo login page
					setTimeout(() => {
						wx.redirectTo({
							url: "/pages/login/login",
						});
					}, 1000);
				} else {
					wx.showToast({
						title: msg || "请求失败，请稍后重试",
						icon: "none",
					});
				}
			},
			fail: () => {
				isShowLoading && wx.hideLoading();
				wx.showToast({
					title: "请求失败，请稍后重试",
					icon: "none",
				});
			},
		});
	},
	downLoadFile: (params, fileName) => {
		const { token } = checkLoginToken(true);
		const { url, ...resParams } = params;
		let header = {
			"content-type": "application/json",
		};
		if (token) {
			header = {
				...header,
				SToken: token,
			};
		}

		wx.showLoading();

		wx.request({
			...resParams,
			url: `${baseUrl}/${url}`,
			header,
			success: res => {
				wx.hideLoading();

				const { data: realRes } = res;
				const { data: downloadUrl, code } = realRes;
				const filePath = `${wx.env.USER_DATA_PATH}/${fileName}.xlsx`;

				code === 100
					? wx.downloadFile({
							url: downloadUrl,
							filePath,
							success: res => {
								wx.openDocument({
									filePath,
									showMenu: true,
									fileType: "xlsx",
									success: () => {},
									fail: e => {},
								});
							},
					  })
					: wx.showToast({
							title: "请求失败，请稍后重试",
							icon: "none",
					  });
			},
			fail: () => {
				wx.showToast({
					title: "请求失败，请稍后重试",
					icon: "none",
				});
			},
		});
	},
};

module.exports = utils;
