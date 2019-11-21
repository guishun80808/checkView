/*
 * @Description: In User Settings Edit
 * @Author: GuiShun
 * @Date: 2019-08-07 09:50:47
 * @LastEditTime: 2019-09-06 11:39:07
 * @LastEditors: Please set LastEditors
 */
import {
  queryAllCourtList,
  // queryAllRoleList,
 
} from "@/api/common";

const state = {
  allCourtList: [],
 
  allRoleList: [],
 
  dealCaseStatusArray: [
    //处理状态
    {
      value: 0,
      text: "上传中"
    },
    {
      value: 1,
      text: "未处理"
    },
    {
      value: 2,
      text: "处理中"
    },
    {
      value: 3,
      text: "处理完成"
    }
  ],
  caseLockArray: [
    //锁定状态
    {
      value: 0,
      text: "未锁定"
    },
    {
      value: 1,
      text: "已锁定"
    }
  ],
  pushCaseStatusList: [
    {
      value: 0,
      text: "未推送"
    },
    {
      value: 1,
      text: "已第一次推送成功"
    },
    {
      value: 2,
      text: "第一次推送失败"
    },
    {
      value: 3,
      text: "分类完成推送成功"
    },
    {
      value: 4,
      text: "分类完成推送失败"
    }
  ],
  invalidFlagList: [
    {
      value: 0,
      text: "正常"
    },
    {
      value: 1,
      text: "失效"
    }
  ],
  outShow: false,
  curMenuList: []
};

const mutations = {
  SET_ALLCOURTLIST: (state, allCourtList) => {
    state.allCourtList = allCourtList;
  },
 
  SET_ALLROLELIST: (state, allRoleList) => {
    state.allRoleList = allRoleList;
  },
  // SET_MENULIST: (state, menuList) => {
  //   sessionStorage.setItem("curMenuList", JSON.stringify(menuList)); //添加到sessionStorage
  //   state.menuList = menuList;
  // }
};

const actions = {
  queryAllCourtList({ commit }) {
    return new Promise((resolve, reject) => {
      queryAllCourtList({"courtId":101})
        .then(response => {
          const { data } = response;
          commit("SET_ALLCOURTLIST", data);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  
  queryAllRoleList({ commit }) {
    return new Promise((resolve, reject) => {
      queryAllRoleList()
        .then(response => {
          const { data } = response;
          commit("SET_ALLROLELIST", data);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  setOutShow({ commit }, data) {
    console.log(data);
    commit("SET_OUTSHOW", data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
