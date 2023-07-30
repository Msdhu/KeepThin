// app.js
import { ROLES } from "/utils/constant";
const utils = require("/utils/util");

// 整个小程序只有一个 App 实例，是全部页面共享的，可以通过 getApp 方法获取到全局唯一的 App 实例
App({
  onLaunch() {
    const globalData = this.globalData;
    wx.getSystemInfo({
      success: (sysInfo) => {
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
  ROLES,
  globalData: {
    provinceList: [],
    systemInfo: {},
    userInfo: {},
    storeInfo: {},
    marginTop: 0,
  },
});
