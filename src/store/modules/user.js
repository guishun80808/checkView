import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
  chart1FlagShow: true,
  chartMOre: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_chart1FlagShow: (state, chart1FlagShow) => {
    state.chart1FlagShow = chart1FlagShow;
  },
  SET_chartMOre: (state, chartMOre) => {
    state.chartMOre = chartMOre;
  },
  SET_USERINFO: (state, userinfo) => {
    sessionStorage.setItem("userInfo", JSON.stringify(userinfo)); //添加到sessionStorage
    state.userInfo = userinfo

  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: username.trim(), userPassword: password }).then(response => {
        const { data } = response
        data.roleMenus = data.roleMenus.sort(function (a, b) {
          return a - b;
        });7
        commit('SET_TOKEN', data)
        commit('SET_USERINFO', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      sessionStorage.removeItem("userInfo"); //移除sessionStorage
      removeToken()
      resetRouter()
      resolve()
      // logout(state.token).then(() => {
      //   commit('SET_TOKEN', '')
      //   removeToken()
      //   resetRouter()
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },
  changeChartFlag({ commit, state }, data) {
    return new Promise(resolve => {
      commit('SET_chart1FlagShow', data.data)
    })
  },
  changeChartMOre({ commit, state }, data) {
    return new Promise(resolve => {
      commit('SET_chartMOre', data.data)
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

