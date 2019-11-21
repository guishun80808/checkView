
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

function getDateStr3(date) {
  var year = "";
  var month = "";
  var day = "";
  var now = date;
  year = "" + now.getFullYear();
  if (now.getMonth() + 1 < 10) {
    month = "0" + (now.getMonth() + 1);
  } else {
    month = "" + (now.getMonth() + 1);
  }
  if (now.getDate() < 10) {
    day = "0" + now.getDate();
  } else {
    day = "" + now.getDate();
  }
  return year + "-" + month + "-" + day;
}

export function getWeekStartAndEnd(AddWeekCount) {
  //起止日期数组
  var startStop = new Array();
  //一天的毫秒数
  var millisecond = 1000 * 60 * 60 * 24;
  //获取当前时间
  var currentDate = new Date();
  //相对于当前日期AddWeekCount个周的日期
  currentDate = new Date(
    currentDate.getTime() + millisecond * 7 * AddWeekCount
  );
  //返回date是一周中的某一天
  var week = currentDate.getDay();
  //返回date是一个月中的某一天
  var month = currentDate.getDate();
  //减去的天数
  var minusDay = week != 0 ? week - 1 : 6;
  //获得当前周的第一天
  var currentWeekFirstDay = new Date(
    currentDate.getTime() - millisecond * minusDay
  );
  //获得当前周的最后一天
  var currentWeekLastDay = new Date(
    currentWeekFirstDay.getTime() + millisecond * 6
  );
  //添加至数组
  startStop.push(getDateStr3(currentWeekFirstDay));
  startStop.push(getDateStr3(currentWeekLastDay));

  return startStop;
}

export function getCurrentMonthFirst() {
  let date = new Date();
  date.setDate(1);
  return date;
}

//获取这周的周一
export function getFirstDayOfWeek(date) {
  let weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
  date.setDate(date.getDate() - weekday + 1); //往前算（weekday-1）天，年份、月份会自动变化
  return parseTime(date, "{y}-{m}-{d}");
}

//获取上月第一天最后一天
export function getLastMonth() {
  let nowdays = new Date();
  let year = nowdays.getFullYear();
  let month = nowdays.getMonth();
  if (month == 0) {
    month = 12;
    year = year - 1;
  }
  if (month < 10) {
    month = "0" + month;
  }
  let myDate = new Date(year, month, 0);
  let startDate = year + "-" + month + "-01"; //上个月第一天
  let endDate = year + "-" + month + "-" + myDate.getDate(); //上个月最后一天
  return {
    start: startDate,
    end: endDate
  };
}

//获取近一年
export function getLastSixMonthYestdy(date) {
  var daysInMonth = new Array(
    [0],
    [31],
    [28],
    [31],
    [30],
    [31],
    [30],
    [31],
    [31],
    [30],
    [31],
    [30],
    [31]
  );
  var strYear = date.getFullYear();
  var strDay = date.getDate();
  var strMonth = date.getMonth() + 1;
  var ystM = 6 - strMonth;
  if (strYear % 4 == 0 && strYear % 100 != 0) {
    daysInMonth[2] = 29;
  }
  if (strMonth < 7) {
    strYear -= 1;
    strMonth = 12 - ystM;
  } else {
    strMonth -= 6;
  }
  strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
  if (strMonth < 10) {
    strMonth = "0" + strMonth;
  }
  if (strDay < 10) {
    strDay = "0" + strDay;
  }
  let datastr = strYear + "-" + strMonth + "-" + strDay;
  return datastr;
}

//获得上一年在昨天这一天的日期
export function getLastYearYestdy(date) {
  var strYear = date.getFullYear() - 1;
  var strDay = date.getDate();
  var strMonth = date.getMonth() + 1;
  if (strMonth < 10) {
    strMonth = "0" + strMonth;
  }
  if (strDay < 10) {
    strDay = "0" + strDay;
  }
  let datastr = strYear + "-" + strMonth + "-" + strDay;
  return datastr;
}


export function getWeekDay() {
  var now = new Date();
  var day = now.getDay();
  var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
  var week = weeks[day];
  return week;
}

export function insertStr(soure, start, newStr) {
  return soure.slice(0, start) + newStr + soure.slice(start);
}

export function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value2 - value1;
  }
}

export const statesList = [
  { name: "全部", id: "" },
  { name: "新移送", id: 1 },
  { name: "立案登记", id: 2 },
  { name: "立案审查", id: 3 },
  { name: "立案审批", id: 4 },
  { name: "等待分派", id: 5 },
  { name: "等待确认", id: 6 },
  { name: "正在审理", id: 7 },
  { name: "立案待结", id: 8 },
  { name: "结案报批", id: 9 },
  { name: "已经结案", id: 10 },
  { name: "已经归档", id: 11 }
];
export const timeList = [
  { name: "本月", id: 1 },
  { name: "上月", id: 2 },
  { name: "本周", id: 3 },
  { name: "上周", id: 4 },
  { name: "今天", id: 5 },
  { name: "昨天", id: 6 },
  { name: "近半年", id: 7 },
  { name: "近一年", id: 8 },
  { name: "自定义", id: 9 }
];

// 大到小排序
export function getMaxSort(nums) {
  for (let i = 0, len = nums.length; i < len - 1; i++) {
    // 如果一轮比较中没有需要交换的数据，则说明数组已经有序。主要是对[5,1,2,3,4]之类的数组进行优化
    let mark = true;
    for (let j = 0; j < len - i - 1; j++) {
      if (nums[j] > nums[j + 1]) {
        [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
        mark = false;
      }
    }
    if (mark) return;
  }
}
