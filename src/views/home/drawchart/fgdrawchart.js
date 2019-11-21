let echarts = require('echarts')
let zhuangshi = require('../../../assets/imgs/zhuangshi.png')
let zhuangshi1 = require('../../../assets/imgs/zhuangshi1.png')

function GetPercent(num, total) {
    num = parseFloat(num);
    total = parseFloat(total);
    if (isNaN(num) || isNaN(total)) {
        return "-";
    }
    return total <= 0 ? "0%" : Math.round((num / total) * 10000) / 100.0 + "%";
}
export function xcDrawChart1(xcChart1Data) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("xcchart1"));
    var option = {
        //电子卷宗制作与质检总体统计报表  
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: true,
                    title: "下载图片",
                    excludeComponents: ["toolbox"],
                    backgroundColor: "rgba(1, 45, 74,1)",
                    iconStyle: {
                        color: "#c3e7ff",
                        borderColor: "#c3e7ff"
                    },
                    pixelRatio: 2
                }
            },
            top: -3,
            right: 5
        },
        title: {
            text: "",
            top: 15,
            textStyle: {
                //标题颜色
                color: "#c3e7ff",
                fontSize: 14
            },
            left: "30"
        },
        grid: {
            // 控制图的大小，调整下面这些值就可以，
            x: 55,
            x2: 10,
            y: 30,
            y2: 30 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
        },
        legend: {
            textStyle: {
                color: "#d4effb"
            },
            right: 35,
            top: 0
        },
        tooltip: {},
        dataset: {
            dimensions: ["product", "总案件量", "制作数量", "合格数量"],
            source: xcChart1Data
        },

        xAxis: {
            type: "category",
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff",
                    color: "#2070db",
                    width: 1
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    fontSize: 12,
                    color: "#d4effb"
                },
                rotate: -30

            }
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff"
                    color: "#2070db"
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    // color: "#c3e7ff"
                    color: "#d4effb"
                },
                // rotate: -30

            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ["#315070"],
                    width: 1,
                    type: "solid"
                }
            }, //网格线
        },
        series: [
            {
                type: "bar",
                barWidth: 10,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0
                        // shadowColor: "rgba(0, 0, 0, 0.5)"
                    },
                    normal: {
                        color: ["#ea7f31"],
                        label: {
                            show: true, //开启显示
                            position: "top", //在上方显示
                            textStyle: {
                                //数值样式
                                color: "#fff",
                                fontSize: 12
                            }
                        },
                    }
                }
            },
            {
                type: "bar",
                barWidth: 10,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0
                        // shadowColor: "rgba(0, 0, 0, 0.5)"
                    },
                    normal: {
                        color: ["#eff143"],
                        label: {
                            show: false, //开启显示
                            position: "top", //在上方显示
                            textStyle: {
                                //数值样式
                                color: "#fff",
                                fontSize: 12
                            }
                        },
                    }
                }
            },
            {
                type: "bar",
                barWidth: 10,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0
                        // shadowColor: "rgba(0, 0, 0, 0.5)"
                    },
                    normal: {
                        color: ["#6dc051"],
                        label: {
                            show: false, //开启显示
                            position: "top", //在上方显示
                            textStyle: {
                                //数值样式
                                color: "#fff",
                                fontSize: 12
                            }
                        },
                    }
                }
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}

export function xcDrawChart2(xcChart2Datas) {
    // console.log(xcChart2Datas)
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("xcchart2"));
    var totleValue = xcChart2Datas[0].value + xcChart2Datas[1].value;
    var c2hegelv = GetPercent(xcChart2Datas[0].value, totleValue);
    var option = {
        graphic: {
            elements: [{
                type: 'image',
                style: {
                    image: zhuangshi,
                    width: 65,
                    height: 65
                },
                left: 'center',
                top: 85
            }]
        },
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: true,
                    title: "下载图片",
                    excludeComponents: ["toolbox"],
                    backgroundColor: "rgba(1, 45, 74,1)",
                    iconStyle: {
                        color: "#fff",
                        borderColor: "#fff"
                    },
                    pixelRatio: 2
                }
            },
            top: 0,
            right: 30
        },
        title: {
            text: "",
            subtext: "电子卷宗合格率：" + c2hegelv,
            bottom: 60,
            textStyle: {
                //标题颜色
                color: "#fff",
                fontSize: 14
            },
            subtextStyle: {
                color: "#fff",
            },
            left: "center"
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} {b} : {c} ({d}%)"
        },
        legend: {
            icon: 'circle',
            // orient: "horizontal",
            orient: "vertical",
            left: "center",
            textStyle: {
                color: "#fff"
            },
            bottom: 0,
            data: ["合格数量", "不合格数量"]
        },
        series: [
            {
                hoverAnimation: false,
                name: " ",
                type: "pie",
                radius: ["55%", "40%"],
                center: ["50%", "42%"],
                label: {
                    normal: {
                        formatter: "{c|{c}}", //图形外文字上下显示
                        borderWidth: 0,
                        borderRadius: 4,
                        padding: [-20, -10], //文字和图的边距
                        rich: {
                            a: {
                                color: '#f6ff00',
                                fontSize: 12,
                                lineHeight: 16
                            },
                            b: {
                                //name 文字样式
                                fontSize: 12,
                                lineHeight: 16,
                                color: '#f6ff00'
                            },
                            c: {
                                //value 文字样式
                                fontSize: 12,
                                lineHeight: 16,
                                color: '#f6ff00',
                                align: "center"
                            }
                        }
                    }
                },
                data: xcChart2Datas,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    },
                    normal: {
                        color: function (params) {
                            // build a color map as your need.
                            var colorList = ["rgb(0,255,240)", "rgb(10,201,190)"];
                            return colorList[params.dataIndex];
                        }
                    }
                }
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function () {
        window.onresize = function () {
            myChart.resize();
        };
    }, 200);
}

export function xcDrawChart3(xcChartDatas) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("xcchart3"));
    var option = {
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: true,
                    title: "下载图片",
                    excludeComponents: ["toolbox"],
                    backgroundColor: "rgba(1, 45, 74,1)",
                    iconStyle: {
                        color: "#c3e7ff",
                        borderColor: "#c3e7ff"
                    },
                    pixelRatio: 2
                }
            },
            top: 0,
            right: 0
        },
        tooltip: {
            trigger: "axis",
            formatter: '{b}：{c}%',
            axisPointer: {
                type: ""
            }
        },
        title: {
            text: "",
            bottom: 8,
            textStyle: {
                //标题颜色
                color: "#c3e7ff",
                fontSize: 14
            },
            left: "center"
        },
        legend: {
            textStyle: {
                color: "#c3e7ff"
            },
            right: 60,
            top: 15,
            show: false
        },
        grid: {
            left: "3%",
            right: "6%",
            bottom: "0%",
            top: "7%",
            containLabel: true
        },
        xAxis: {
            type: "value",
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff",
                    color: "#2070db",
                    width: 1
                },
                textStyle: {
                    // color: "#c3e7ff"
                    color: "#d4effb"
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    // color: "#c3e7ff"
                    color: "#d4effb"
                },
                formatter: '{value}%'
                // rotate: -30
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ["#315070"],
                    width: 1,
                    type: "solid"
                }
            }, //网格线
            boundaryGap: [0, 0.01]
        },

        yAxis: {
            type: "category",
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff"
                    color: "#2070db"
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    // color: "#c3e7ff"
                    color: "#d4effb"
                },
                // rotate: -30

            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ["#315070"],
                    width: 1,
                    type: "solid"
                }
            }, //网格线
            data: xcChartDatas.cityNames
        },
        series: [
            {
                name: "合格率",
                type: "bar",
                barWidth: 10,
                itemStyle: {
                    normal: {
                        // color: ["rgb(0,133,253)"],
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: 'rgb(0,133,253)'
                        }, {
                            offset: 0.7,
                            color: 'rgb(0,248,241)'
                        }]),
                        barBorderRadius: [0, 10, 10, 0],
                        label: {
                            show: false, //开启显示
                            formatter: '{c}%',
                            position: "top", //在右方显示
                            textStyle: {
                                //数值样式
                                color: "white",
                                fontSize: 12
                            }
                        }
                        // color: function(params) {
                        //   // build a color map as your need.
                        //   var colorList = ["rgb(91,155,213)"];
                        //   return colorList[params.dataIndex];
                        // }
                    }
                },
                // data: [20, 33, 25, 45, 66, 52, 19, 54, 49, 71, 10, 50]
                // data: cityDtaasChatr3.citySource
                data: xcChartDatas.citySource
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function () {
        window.onresize = function () {
            myChart.resize();
        };
    }, 200);
}

export function xcDrawChart4(xcChart4Datas) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("xcchart4"));
    var totleValue = xcChart4Datas[0].value + xcChart4Datas[1].value;
    var c2hegelv = GetPercent(xcChart4Datas[0].value, totleValue);
    var option = {
        graphic: {
            elements: [{
                type: 'image',
                style: {
                    image: zhuangshi1,
                    width: 65,
                    height: 65
                },
                left: 'center',
                top: 85
            }]
        },
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: true,
                    title: "下载图片",
                    excludeComponents: ["toolbox"],
                    backgroundColor: "rgba(1, 45, 74,1)",
                    iconStyle: {
                        color: "#fff",
                        borderColor: "#fff"
                    },
                    pixelRatio: 2
                }
            },
            top: 0,
            right: 0
        },
        title: {
            text: "",
            subtext: "电子卷宗制作率：" + c2hegelv,
            bottom: 60,
            textStyle: {
                //标题颜色
                color: "#fff",
                fontSize: 14
            },
            subtextStyle: {
                color: "#fff",
            },
            left: "center"
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} {b} : {c} ({d}%)"
        },
        legend: {
            icon: 'circle',
            orient: "horizontal",
            // orient: "vertical",
            left: "center",
            textStyle: {
                color: "#fff"
            },
            bottom: 0,
            data: ["上传案件数量", "未上传案件数量"]
        },
        series: [
            {
                hoverAnimation: false,
                name: " ",
                type: "pie",
                radius: ["55%", "40%"],
                center: ["50%", "42%"],
                label: {
                    normal: {
                        formatter: "{c|{c}}", //图形外文字上下显示
                        borderWidth: 0,
                        borderRadius: 0,
                        padding: [-20, -10], //文字和图的边距
                        rich: {
                            a: {
                                color: '#f6ff00',
                                fontSize: 12,
                                lineHeight: 16
                            },
                            b: {
                                //name 文字样式
                                fontSize: 12,
                                lineHeight: 16,
                                color: '#f6ff00'
                            },
                            c: {
                                //value 文字样式
                                fontSize: 12,
                                lineHeight: 16,
                                color: '#f6ff00',
                                align: "center"
                            }
                        }
                    }
                },
                data: xcChart4Datas,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    },
                    normal: {
                        color: function (params) {
                            // build a color map as your need.
                            var colorList = ["rgb(0,255,192)", "rgb(32,192,153)"];
                            return colorList[params.dataIndex];
                        }
                    }
                }
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function () {
        window.onresize = function () {
            myChart.resize();
        };
    }, 200);
}

export function xcDrawChart5(xcChart5Dtaas) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("xcchart5"));
    var option = {
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: true,
                    title: "下载图片",
                    excludeComponents: ["toolbox"],
                    backgroundColor: "rgba(1, 45, 74,1)",
                    iconStyle: {
                        color: "#c3e7ff",
                        borderColor: "#c3e7ff"
                    },
                    pixelRatio: 2
                }
            },
            top: 0,
            right: 0
        },
        tooltip: {
            trigger: "axis",
            formatter: '{b}：{c}%',
            axisPointer: {
                type: ""
            }
        },
        title: {
            text: "",
            bottom: 8,
            textStyle: {
                //标题颜色
                color: "#c3e7ff",
                fontSize: 14
            },
            left: "center"
        },
        legend: {
            textStyle: {
                color: "#c3e7ff"
            },
            right: 60,
            top: 15,
            show: false
        },
        grid: {
            left: "3%",
            right: "6%",
            bottom: "0%",
            top: "7%",
            containLabel: true
        },
        xAxis: {
            type: "value",
            axisLabel: {
                show: true,
                interval: 'auto',
                formatter: '{value}%'
            },
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff",
                    color: "#2070db",
                    width: 1
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    // color: "#c3e7ff"
                    color: "#d4effb"
                },
                formatter: '{value}%'
                // rotate: -30
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ["#315070"],
                    width: 1,
                    type: "solid"
                }
            }, //网格线
            boundaryGap: [0, 0.01]
        },

        yAxis: {
            type: "category",
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff"
                    color: "#2070db"
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    // color: "#c3e7ff"
                    color: "#d4effb"
                },
                // rotate: -30

            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ["#315070"],
                    width: 1,
                    type: "solid"
                }
            }, //网格线
            data: xcChart5Dtaas.cityNames
        },
        series: [
            {
                name: "制作率",
                type: "bar",
                barWidth: 10,
                itemStyle: {
                    normal: {
                        // color: ["rgb(0,133,253)"],
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                            offset: 0,
                            color: 'rgb(0,205,137)'
                        }, {
                            offset: 0.7,
                            color: 'rgb(0,254,191)'
                        }]),
                        barBorderRadius: [0, 10, 10, 0],
                        label: {
                            show: false, //开启显示
                            formatter: '{c}%',
                            position: "top", //在右方显示
                            textStyle: {
                                //数值样式
                                color: "white",
                                fontSize: 12
                            }
                        }
                        // color: function(params) {
                        //   // build a color map as your need.
                        //   var colorList = ["rgb(91,155,213)"];
                        //   return colorList[params.dataIndex];
                        // }
                    }
                },
                // data: [20, 33, 25, 45, 66, 52, 19, 54, 49, 71, 10, 50]
                // data: cityDtaasChatr3.citySource
                data: xcChart5Dtaas.citySource
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    setTimeout(function () {
        window.onresize = function () {
            myChart.resize();
        };
    }, 200);
}

export function xcDrawChart6(xcChart6datas) {
    var myChart = echarts.init(document.getElementById("xcchart6"));
    var option = {
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: true,
                    title: "下载图片",
                    excludeComponents: ["toolbox"],
                    backgroundColor: "rgba(1, 45, 74,1)",
                    iconStyle: {
                        color: "#c3e7ff",
                        borderColor: "#c3e7ff"
                    },
                    pixelRatio: 2
                }
            },
            top: 10,
            right: 30
        },
        title: {
            // text: "本年电子卷宗制作与质检趋势图",
            text: "",
            textStyle: {
                //标题颜色
                color: "#c3e7ff",
                fontSize: 14
            },
            top: 12,
            left: 12
        },
        tooltip: {
            // trigger: "axis"
        },
        legend: {
            data: ["总案件数量", "已上传案件数量", "合格案件数量"],
            textStyle: {
                color: "#c3e7ff"
            },
            top: 15,
            right: 80
        },
        grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
        },
        xAxis: {
            type: "category",
            name: "",
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff",
                    color: "#2070db",
                    width: 1
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ["#5e81fd"],
                    width: 1,
                    type: "solid"
                }
            }, //网格线
            axisLabel: {

                interval: 0,
                textStyle: {
                    color: "#c3e7ff"
                }
                // rotate: -40
            },
            boundaryGap: false,
            data: xcChart6datas.times
        },
        yAxis: {
            type: "value",
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff",
                    color: "#2070db",
                    width: 1
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: ["#1859af"],
                    width: 1,
                    type: "solid"
                }
            }, //网格线
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: "#c3e7ff"
                }
                // rotate: -40
            }
        },
        series: [
            {
                name: "总案件数量",
                type: "line",
                symbol: "circle", //设定为实心点
                // symbol: "rect", //设定多边形
                symbolSize: 10, //设定实心点的大小
                itemStyle: {
                    normal: {
                        color: ["rgb(28,240,253)"],
                        label: {
                            show: false, //开启显示
                            position: "top", //在上方显示
                            textStyle: {
                                //数值样式
                                color: "white",
                                fontSize: 12
                            }
                        }
                    }
                },
                areaStyle: {
                    normal: {
                        //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{

                            offset: 0,
                            color: 'rgba(80,141,255,0.49)'
                        }, {
                            offset: .34,
                            color: 'rgba(56,155,255,0.25)'
                        }, {
                            offset: 1,
                            color: 'rgba(38,197,254,0.00)'
                        }])

                    }
                },//区域颜色渐变
                data: xcChart6datas.allCaseNum
            },
            {
                name: "已上传案件数量",
                type: "line",
                // symbol: "rect", //设定多边形
                symbol: "circle", //设定多边形
                symbolSize: 10, //设定实心点的大小
                itemStyle: {
                    normal: {
                        // color:["#864efb"]
                        color: ["rgb(247,116,255)"]
                    }
                },
                areaStyle: {
                    normal: {
                        //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{

                            offset: 0,
                            color: 'rgba(80,141,255,0.49)'
                        }, {
                            offset: .34,
                            color: 'rgba(56,155,255,0.25)'
                        }, {
                            offset: 1,
                            color: 'rgba(38,197,254,0.00)'
                        }])

                    }
                },//区域颜色渐变
                data: xcChart6datas.upLoadCaseNum
            },
            {
                name: "合格案件数量",
                type: "line",
                // symbol: "rect", //设定多边形
                symbol: "circle", //设定为实心点
                symbolSize: 10, //设定实心点的大小
                itemStyle: {
                    normal: {
                        // color:["#0064fa"]
                        color: ["rgb(25,117,255)"]
                    }
                },
                areaStyle: {
                    normal: {
                        //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{

                            offset: 0,
                            color: 'rgba(80,141,255,0.49)'
                        }, {
                            offset: .34,
                            color: 'rgba(56,155,255,0.25)'
                        }, {
                            offset: 1,
                            color: 'rgba(38,197,254,0.00)'
                        }])

                    }
                },//区域颜色渐变
                data: xcChart6datas.passCaseCount
            }
        ]
    };
    myChart.setOption(option);
    setTimeout(function () {
        window.onresize = function () {
            myChart.resize();
        };
    }, 200);
}

export function xcDrawChart5More(xcChart1Data) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("chart5More"));
    var option = {
        //电子卷宗制作与质检总体统计报表  
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: true,
                    title: "下载图片",
                    excludeComponents: ["toolbox"],
                    backgroundColor: "rgba(1, 45, 74,1)",
                    iconStyle: {
                        color: "#c3e7ff",
                        borderColor: "#c3e7ff"
                    },
                    pixelRatio: 2
                }
            },
            top: -3,
            right: 5
        },
        title: {
            text: "",
            top: 15,
            textStyle: {
                //标题颜色
                color: "#c3e7ff",
                fontSize: 14
            },
            left: "30"
        },
        grid: {
            // 控制图的大小，调整下面这些值就可以，
            x: 55,
            x2: 10,
            y: 40,
            y2: 100 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
        },
        legend: {
            textStyle: {
                color: "#d4effb"
            },
            right: 35,
            top: 0
        },
        tooltip: {
            trigger: "axis",
            formatter: function (params) {
                var res =
                    params[0].axisValue + "：" + params[0].data["合格率"] + "%";
                return res;
            },
            axisPointer: {
                type: ""
            }
        },
        dataset: {
            dimensions: ["product", "合格率"],
            source: xcChart1Data
        },

        xAxis: {
            type: "category",
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff",
                    color: "#2070db",
                    width: 1
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    fontSize: 12,
                    color: "#d4effb"
                },
                rotate: -30

            }
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff"
                    color: "#2070db"
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    // color: "#c3e7ff"
                    color: "#d4effb"
                },
                // rotate: -30

            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ["#315070"],
                    width: 1,
                    type: "solid"
                }
            }, //网格线
        },
        series: [
            {
                type: "bar",
                barWidth: 10,
                itemStyle: {
                    normal: {
                        // color: ["rgb(0,133,253)"],
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                            offset: 0,
                            color: 'rgb(0,205,137)'
                        }, {
                            offset: 0.7,
                            color: 'rgb(0,254,191)'
                        }]),
                        barBorderRadius: [10, 10, 0, 0],
                        label: {
                            show: true, //开启显示
                            formatter: function (params) {
                                return params.data["制作率"] + "%"
                            },
                            position: "top", //在右方显示
                            textStyle: {
                                //数值样式
                                color: "white",
                                fontSize: 12
                            }
                        }
                        // color: function(params) {
                        //   // build a color map as your need.
                        //   var colorList = ["rgb(91,155,213)"];
                        //   return colorList[params.dataIndex];
                        // }
                    }
                },
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}

export function xcDrawChart3More(xcChart1Data) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("chart3More"));
    var option = {
        //电子卷宗制作与质检总体统计报表  
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: true,
                    title: "下载图片",
                    excludeComponents: ["toolbox"],
                    backgroundColor: "rgba(1, 45, 74,1)",
                    iconStyle: {
                        color: "#c3e7ff",
                        borderColor: "#c3e7ff"
                    },
                    pixelRatio: 2
                }
            },
            top: -3,
            right: 5
        },
        title: {
            text: "",
            top: 15,
            textStyle: {
                //标题颜色
                color: "#c3e7ff",
                fontSize: 14
            },
            left: "30"
        },
        grid: {
            // 控制图的大小，调整下面这些值就可以，
            x: 55,
            x2: 10,
            y: 40,
            y2: 100 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
        },
        legend: {
            textStyle: {
                color: "#d4effb"
            },
            right: 35,
            top: 0
        },
        tooltip: {
            trigger: "axis",
            formatter: function (params) {
                var res =
                    params[0].axisValue + "：" + params[0].data["制作率"] + "%";
                return res;
            },
            axisPointer: {
                type: ""
            }
        },
        dataset: {
            dimensions: ["product", "制作率"],
            source: xcChart1Data
        },

        xAxis: {
            type: "category",
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff",
                    color: "#2070db",
                    width: 1
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    fontSize: 12,
                    color: "#d4effb"
                },
                rotate: -30

            }
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff"
                    color: "#2070db"
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    // color: "#c3e7ff"
                    color: "#d4effb"
                },
                // rotate: -30

            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ["#315070"],
                    width: 1,
                    type: "solid"
                }
            }, //网格线
        },
        series: [
            {
                type: "bar",
                barWidth: 10,
                itemStyle: {
                    normal: {
                        // color: ["rgb(0,133,253)"],
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                            offset: 0,
                            color: 'rgb(0,133,253)'
                        }, {
                            offset: 0.7,
                            color: 'rgb(0,248,241)'
                        }]),
                        barBorderRadius: [10, 10, 0, 0],
                        label: {
                            show: true, //开启显示
                            formatter: function (params) {
                                return params.data["制作率"] + "%"
                            },
                            position: "top", //在右方显示
                            textStyle: {
                                //数值样式
                                color: "white",
                                fontSize: 12
                            }
                        }
                        // color: function(params) {
                        //   // build a color map as your need.
                        //   var colorList = ["rgb(91,155,213)"];
                        //   return colorList[params.dataIndex];
                        // }
                    }
                },
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}

export function xcDrawChart1More(xcChart1Data) {
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById("chart1More"));
    var option = {
        //电子卷宗制作与质检总体统计报表  
        toolbox: {
            show: false,
            feature: {
                saveAsImage: {
                    show: true,
                    title: "下载图片",
                    excludeComponents: ["toolbox"],
                    backgroundColor: "rgba(1, 45, 74,1)",
                    iconStyle: {
                        color: "#c3e7ff",
                        borderColor: "#c3e7ff"
                    },
                    pixelRatio: 2
                }
            },
            top: -3,
            right: 5
        },
        title: {
            text: "",
            top: 15,
            textStyle: {
                //标题颜色
                color: "#c3e7ff",
                fontSize: 14
            },
            left: "30"
        },
        grid: {
            // 控制图的大小，调整下面这些值就可以，
            x: 55,
            x2: 10,
            y: 30,
            y2: 100 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
        },
        legend: {
            textStyle: {
                color: "#d4effb"
            },
            right: 35,
            top: 0
        },
        tooltip: {},
        dataset: {
            dimensions: ["product", "总案件量", "制作数量", "合格数量"],
            source: xcChart1Data
        },

        xAxis: {
            type: "category",
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff",
                    color: "#2070db",
                    width: 1
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    fontSize: 12,
                    color: "#d4effb"
                },
                rotate: -30

            }
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    // color: "#c3e7ff"
                    color: "#2070db"
                }
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    // color: "#c3e7ff"
                    color: "#d4effb"
                },
                // rotate: -30

            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ["#315070"],
                    width: 1,
                    type: "solid"
                }
            }, //网格线
        },
        series: [
            {
                type: "bar",
                barWidth: 10,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0
                        // shadowColor: "rgba(0, 0, 0, 0.5)"
                    },
                    normal: {
                        color: ["#ea7f31"],
                        label: {
                            show: true, //开启显示
                            position: "top", //在上方显示
                            textStyle: {
                                //数值样式
                                color: "#fff",
                                fontSize: 12
                            }
                        },
                    }
                }
            },
            {
                type: "bar",
                barWidth: 10,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0
                        // shadowColor: "rgba(0, 0, 0, 0.5)"
                    },
                    normal: {
                        color: ["#eff143"],
                        label: {
                            show: false, //开启显示
                            position: "top", //在上方显示
                            textStyle: {
                                //数值样式
                                color: "#fff",
                                fontSize: 12
                            }
                        },
                    }
                }
            },
            {
                type: "bar",
                barWidth: 10,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0
                        // shadowColor: "rgba(0, 0, 0, 0.5)"
                    },
                    normal: {
                        color: ["#6dc051"],
                        label: {
                            show: false, //开启显示
                            position: "top", //在上方显示
                            textStyle: {
                                //数值样式
                                color: "#fff",
                                fontSize: 12
                            }
                        },
                    }
                }
            }
        ]
    };

    // 为echarts对象加载数据
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}