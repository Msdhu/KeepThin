const app = getApp();
const { utils, globalData, ROLES } = app;

const { formatTime } = utils;
let nowTime = Date.now();
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
		minDate: new Date(2023, 6, 1).getTime(),
		maxDate: nowTime,
		defaultDate: null,
	},
	attached() {},
	observers: {},
	methods: {
		onConfirmCalendar(e) {
			const detail = e.detail;
			if (Array.isArray(detail)) {
				this.triggerEvent("onConfirmCalendar", [
					formateDate(detail[0]),
					formateDate(detail[1]),
				]);
			} else {
				this.triggerEvent("onConfirmCalendar", formateDate(detail));
			}
			this.initDefaultDate();
		},
		onCloseCalendar() {
			var e = this;
			this.triggerEvent("onCloseCalendar", "close");
			this.setData(
				{
					showCalendar: false,
				},
				function () {
					e.initDefaultDate();
				}
			);
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
