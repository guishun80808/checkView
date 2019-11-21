import request from "@/utils/request";

export function userCourRoomById(params) {
  return request({
    url: "/user/queryByCourtRoom",
    method: "get",
    params
  });
}
