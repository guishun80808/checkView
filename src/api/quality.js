import request from '@/utils/request'

export function getAllArea() {
	return request({
		url: '/tableName/queryAllArea',
		method: 'get',
	})
}

export function getCourtList(params) {
	return request({
		url: '/court/queryByCourtId',
		method: 'get',
		params
	})
}

export function getAllCaseType() {
	return request({
		url: '/caseType/queryAllCaseType',
		method: 'get',
	})
}

export function getAllCourtNames() {
	return request({
		url: '/court/queryCourtNames',
		method: 'get',
	})
}

export function getRoomsByCourtId(params) {
	return request({
		url: '/courtRoom/queryByCourtId',
		method: 'get',
		params
	})
}

export function getCbrsByRoomId(params) {
	return request({
		url: '/user/queryByCourtRoom',
		method: 'get',
		params
	})
}

export function getSpcxByCasetypeId(params) {
	return request({
		url: '/caseType/queryByCaseTypeId',
		method: 'get',
		params
	})
}

export function getCaseStatistics(params) {
	return request({
		url: '/caseStatistics/queryCaseCount2',
		method: 'get',
		params
	})
}

export function getAllCaseInfo(params) {
	return request({
		url: '/caseInfo/queryCaseInfoByParam',
		method: 'get',
		params
	})
}

export function getCountTrend(params) {
	return request({
		url: '/caseStatistics/queryCaseCountTrend',
		method: 'get',
		params
	})
}

//获取问题案号
export function getFailCaseList(params) {
	return request({
		url: '/caseInfo/queryCaseInfoByParam',
		method: 'get',
		params
	})
}

//下载excle
export function exportCaseList(params) {
	return request({
		url: '/export/exportCaseList',
		method: 'get',
		params
	})
}

//查询所有法院列表
export function getAllCourtList() {
	return request({
		url: '/court/queryCourtNames',
		method: 'get'
	})
}

//批注
export function postilCase(data) {
	return request({
		url: '/caseInfo/updateDealCaseMessage',
		method: 'post',
		data
	})
}

//核实
export function checkCase(params) {
	return request({
		url: '/caseInfo/updateCheckCaseResult',
		method: 'get',
		params
	})
}
