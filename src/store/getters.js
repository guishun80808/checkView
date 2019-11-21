const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userInfo: state => state.user.userInfo,
  name: state => state.user.name,
  chart1FlagShow: state => state.user.chart1FlagShow,
  chartMOre:  state => state.user.chartMOre,
  allCourtList: state => state.common.allCourtList, //法院列表
  allCourtTreeList: state => state.common.allCourtTreeList, //法院树形列表
  allRoleList: state => state.common.allRoleList, //角色列表

}
export default getters
