
import request from "@/utils/request";

export function getCaseType(data) {
    return request({
      url: "/caseType/queryAllCaseType",
      method: "post",
      data
    });
}
export function getSpcxList(params) {
    return request({
      url: "/caseType/queryByCaseTypeId",
      method: "get",
      params
    });
}
export function getCaseCheckInfo(params) {
    return request({
      url: "/rule/queryCaseCheckInfo",
      method: "get",
      params
    });
}

export function getDirectory(params) {
    return request({
      url: "/directory/queryDirectoryTree",
      method: "get",
      params
    });
}

export function addCaseCheckInfo(data) {
    return request({
      url: "/rule/addCaseCheckInfo",
      method: "post",
      data
    });
}
export function delMuLvRule(params) {
  return request({
    url: "/rule/removeCaseCheckInfo",
    method: "get",
    params
  });
}

export function editCaseCheckInfo(data) {
  return request({
    url: "/rule/updateCaseCheckInfo",
    method: "post",
    data
  });
}
  