/*
 * @Description: In User Settings Edit
 * @Author: chenjian
 * @Date: 2019-08-07 09:50:48
 * @LastEditTime: 2019-09-03 10:47:15
 * @LastEditors: Please set LastEditors
 */
import request from "@/utils/request";

export function queryAllCourtList(params) {
  return request({
    url: "/court/queryByCourtId",
    method: "get",
    params
  });
}
export function getCourtRoomById(params) {
  return request({
    url: "/courtRoom/queryByCourtId",
    method: "get",
    params
  });
}
export function getUserList(params) {
  return request({
    url: "/user/queryUser",
    method: "get",
    params
  });
}
export function getRoleList() {
  return request({
    url: "/role/listAllRole",
    method: "get"
  });
}
//新增用户
export function addUser(data) {
  return request({
    url: "/user/addUser",
    method: "POST",
    data
  });
}

export function editUser(data) {
  return request({
    url: "/user/updateUser",
    method: "POST",
    data
  });
}

export function delUser(params) {
  return request({
    url: "/user/removeUser",
    method: "get",
    params
  });
}



export function queryAllRoleList() {
  return request({
    url: "/role/queryAllRole",
    method: "post"
  });
}












