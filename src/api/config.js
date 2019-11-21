
import request from "@/utils/request";

export function getPropList(params) {
    return request({
      url: "/property/queryByParam",
      method: "get",
      params
    });
}

export function addProp(data) {
  return request({
    url: "/property/addProperty",
    method: "post",
    data
  });
}

export function delCofig(params) {
  return request({
    url: "/property/removeProperty",
    method: "get",
    params
  });
}
export function editProp(data) {
  return request({
    url: "/property/updateProperty",
    method: "post",
    data
  });
}