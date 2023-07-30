const app = getApp();
const { utils } = app;

Page({
  data: {
    durationInfo: { enter: 300, leave: 500 },
  },
  onShow() {
    const { needLogin } = utils.checkLoginToken();
    if (!needLogin) {
      app.globalData.userInfo = {
        ...app.globalData.userInfo,
        // 更新用户类型
        roleType: Number(wx.getStorageSync("loginInfo").level),
      };
    }
    setTimeout(function () {
      wx.redirectTo({
        url: needLogin ? "/pages/login/login" : "/pages/index/index",
      });
    }, 1000);
  },
});
