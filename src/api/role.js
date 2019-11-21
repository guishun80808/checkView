import request from "@/utils/request";

export function queryAllMenus(data) {
    return request({
      url: "/menu/queryAllMenus",
      method: "post",
      data
    });
  }
  
  export function addRole(data) {
    return request({
      url: "/role/addRole",
      method: "post",
      data
    });
  }
  export function editRole(data) {
    return request({
      url: "/role/updateRole",
      method: "post",
      data
    });
  }
  export function delRole(params) {
    return request({
      url: "/role/removeRole",
      method: "get",
      params
    });
  }