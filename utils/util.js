const fillNum = (n) => {
	n = n.toString();
	return n[1] ? n : `0${n}`;
};

module.exports = {
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
			.map((key) => `${key}=${obj[key]}`)
			.join("&");
	},
	checkPhone(phone) {
		const reg =
			/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
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
};
