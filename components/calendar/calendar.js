const app = getApp();
const { utils, globalData, ROLES } = app;

const { formatTime } = utils;

const nowTime = Date.now();
function formateDate(timeStr) {
	const dateTxt = formatTime(new Date(timeStr), "YYYY-MM-DD");
	const nowDateTxt = formatTime(new Date(), "hh:mm:ss");
	return `${dateTxt} ${nowDateTxt}`;
}
Component({
	properties: {
		showCalendar: Boolean,
		tabIndex: Number,
	},
	data: {
		minDate: new Date(2023, 0, 1).getTime(),
		maxDate: nowTime,
		defaultDate: null,
	},
	lifetimes: {
		attached() {
			this.initDefaultDate();
		},
	},
	methods: {
		onConfirmCalendar(e) {
			const detail = e.detail;
			if (Array.isArray(detail)) {
				this.triggerEvent("onConfirmCalendar", [formateDate(detail[0]), formateDate(detail[1])]);
			} else {
				this.triggerEvent("onConfirmCalendar", formateDate(detail));
			}
		},
		onCloseCalendar() {
			this.triggerEvent("onCloseCalendar", "close");
			this.setData({
				showCalendar: false,
			});
		},
		initDefaultDate() {
			const nowTime = Date.now();
			if (this.data.tabIndex == 0) {
				this.setData({
					defaultDate: nowTime,
				});
			} else {
				this.setData({
					defaultDate: [nowTime, nowTime],
				});
			}
		},
	},
});
