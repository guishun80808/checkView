<template>
  <div id="tendency">
    <el-row
      :gutter="10"
      style="margin:0;background: rgb(8,45,111);padding-bottom:20px;padding:20px"
    >
      <p class="r_header_title">
        <span class="y_line"></span>统计报表
      </p>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="grid-content bg-purple">
          <el-form :inline="true" :model="params" class="demo-form-inline">
            <el-form-item label="地区：" v-if="areaShowFlag">
              <el-select
                v-model="areaId"
                placeholder="请选择"
                class="search_select"
                @change="selArea"
                clearable
              >
                <el-option
                  v-for="item in allAreaList"
                  :key="item.courtId"
                  :label="item.courtAreaName"
                  :value="item.courtId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="法院：" v-if="courtShowFlag">
              <el-select
                v-model="params.courtId "
                placeholder="请选择"
                class="search_select"
                @change="selCourt"
                clearable
              >
                <el-option
                  v-for="item in courtList"
                  :key="item.courtId"
                  :label="item.courtName"
                  :value="item.courtId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="庭室：" v-if="roomShowFlag">
              <el-select
                v-model="params.courtRoomId "
                placeholder="请选择"
                class="search_select"
                clearable
                @change="selRoom"
              >
                <el-option
                  v-for="item in courtRoomList"
                  :key="item.courtRoomId"
                  :label="item.courtRoomName"
                  :value="item.courtRoomId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="承办人：" v-if="cbrShowFlag">
              <el-select
                v-model="params.cbrId "
                placeholder="请选择"
                class="search_select"
                clearable
                @change="selCbr"
              >
                <el-option
                  v-for="item in cbrList"
                  :key="item.userCode"
                  :label="item.userFullName"
                  :value="item.userCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                style="margin-left:30px;"
                round
                v-preventReClick="1000"
                @click="onSearch"
              >搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div class="content">
      <div class="tjmsgbox clearfix">
        <div class="msg tjmsg">
          <span>年度电子卷宗制作与质检总体趋势报表</span>
        </div>
        <div class="btns tjbtns">
          <el-button type="warning" round @click="toggleEcharts">{{toggleTitle}}</el-button>
          <el-button type="warning" round @click="exportExcel">导出</el-button>
          <!-- <el-button type="info" round v-print="'#printTest'">打印</el-button> -->
           <el-button type="info" round @click="printContent">打印</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        :stripe="true"
        height="550"
        style="background: #061b54;"
        id="printTest"
        v-show="toggleEchartsFlag"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="months" label="月份"></el-table-column>
        <el-table-column prop="caseCount" label="案件数量"></el-table-column>
        <el-table-column prop="uploadCaseCount" label="已上传案件数量"></el-table-column>
        <el-table-column prop="passCaseCount" label="合格案件数量"></el-table-column>
      </el-table>
      <div class="chart">
        <div
          id="chart"
          style="width:1600px;height:600px;margin:0 auto;"
          v-show="!toggleEchartsFlag"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
let echarts = require("echarts");
import Print from "print-js";
import { mapGetters } from "vuex";
import {
  parseTime,
  getWeekStartAndEnd,
  getCurrentMonthFirst,
  getFirstDayOfWeek,
  getLastMonth,
  getLastSixMonthYestdy,
  getLastYearYestdy,
  statesList,
  timeList,
  insertStr
} from "@/utils";
import {
  getAllArea,
  getCourtList,
  getAllCaseType,
  getRoomsByCourtId,
  getCbrsByRoomId,
  getSpcxByCasetypeId,
  getCaseStatistics,
  getAllCaseInfo,
  getCountTrend
} from "@/api/quality";
export default {
  props: {},
  data() {
    return {
      toggleTitle: "生成图表",
      toggleEchartsFlag: true,
      chartDatas: {
        times: [],
        allCaseNum: [],
        upLoadCaseNum: [],
        passCaseCount: []
      },
      dialogVisible: false,
      params: {
        courtId: "",
        courtRoomId: "",
        cbrId: "",
        flag: false
      },
      areaId: "",
      allAreaList: [],
      courtRoomList: [],
      cbrList: [],
      courtList: [],
      tableData: [],
      areaShowFlag: false,
      courtShowFlag: false,
      roomShowFlag: false,
      cbrShowFlag: false,
      searchFlag: true
      // selAreaFlag: true,
      // selCourtFlag: false,
      // selRoomFlag: false,
      // selCbrFlag: false
    };
  },
  computed: {
    ...mapGetters(["token", "userInfo"])
  },
  created() {
    this.getAllArea();
    this.getCaseStatistics();
  },
  mounted() {
    this.changeData();
    this.$bus.$emit("on-click", "/statistics");
  },
  watch: {},
  methods: {
    drawEcharts(datas) {
      var myChart = echarts.init(document.getElementById("chart"));
      var option = {
        toolbox: {
          show: true,
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
          data: datas.times
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(80,141,255,0.49)"
                  },
                  {
                    offset: 0.34,
                    color: "rgba(56,155,255,0.25)"
                  },
                  {
                    offset: 1,
                    color: "rgba(38,197,254,0.00)"
                  }
                ])
              }
            }, //区域颜色渐变
            data: datas.allCaseNum
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(80,141,255,0.49)"
                  },
                  {
                    offset: 0.34,
                    color: "rgba(56,155,255,0.25)"
                  },
                  {
                    offset: 1,
                    color: "rgba(38,197,254,0.00)"
                  }
                ])
              }
            }, //区域颜色渐变
            data: datas.upLoadCaseNum
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(80,141,255,0.49)"
                  },
                  {
                    offset: 0.34,
                    color: "rgba(56,155,255,0.25)"
                  },
                  {
                    offset: 1,
                    color: "rgba(38,197,254,0.00)"
                  }
                ])
              }
            }, //区域颜色渐变
            data: datas.passCaseCount
          }
        ]
      };
      myChart.setOption(option);
      setTimeout(function() {
        window.onresize = function() {
          myChart.resize();
        };
      }, 200);
    },
    toggleEcharts() {
      this.toggleEchartsFlag = !this.toggleEchartsFlag;
      if (!this.toggleEchartsFlag) {
        this.toggleTitle = "生成表格";
      } else {
        this.toggleTitle = "生成图表";
      }
    },
    //打印页面内容
    printContent() {
      const style = "@page { margin: 0 } @media *{text-align:center} print { text-align:center} table{text-align:center}"; //自定义样式
      Print({
        printable: "printTest",
        type: "html",
        // 继承原来的所有样式
        // targetStyles: ["*"],
        style: style
        // scanStyles: false
      });
    },
    //导出的方法
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/excel/Export2Excel");
        let tHeader = ["所属", "电子卷宗制作数量"]; // 上面设置Excel的表格第一行的标题
        let filterVal = ["月份", "uploadCaseCount"]; // 上面是tableData里对象的属性
        const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "统计报表excel");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    changeData() {
      this.$emit("changeData", "/statistics/tendency");
    },
    async selArea(id) {
      if (id === "") {
        this.params.flag = false;
        this.courtRoomList = [];
        this.cbrList = [];
        this.params.courtRoomId = "";
        this.params.cbrId = "";
        this.params.courtId = "";
        this.courtList = [];
        return;
      }
      this.params.flag = false;
      this.courtRoomList = [];
      this.cbrList = [];
      this.params.courtRoomId = "";
      this.params.cbrId = "";
      this.params.courtId = "";
      this.courtList = [];
      try {
        const { data } = await getCourtList({ courtId: id });
        this.courtList = data.children;
        this.courtList.unshift(data);
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询法院列表失败",
          type: "warning"
        });
      }
    },
    async selCourt(id) {
      this.params.cbrId = "";
      this.params.courtRoomId = "";
      this.courtRoomList = [];
      this.cbrList = [];
      this.params.flag = true;
      if (id == "") {
        return;
      }
      try {
        const { data } = await getRoomsByCourtId({ courtId: id });
        this.courtRoomList = data;
      } catch (err) {
        console.log(err);
        // this.$message({
        //   message: "查询庭室列表失败",
        //   type: "warning"
        // });
      }
    },

    async selRoom(id) {
      this.params.flag = true;
      this.params.cbrId = "";
      this.cbrList = [];
      if (id == "") {
        return;
      }
      try {
        const { data } = await getCbrsByRoomId({
          courtId: this.params.courtId,
          courtRoomId: id
        });
        if (data.length == 0) {
          this.$message({
            message: "该庭室下暂无法官信息",
            type: "warning"
          });
          this.params.cbrId = "";
          return;
        }
        this.cbrList = data;
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询承办人列表失败",
          type: "warning"
        });
      }
    },
    selCbr(id) {
      this.params.flag = true;
      console.log(id);
      if (id == "") {
        return;
      }
    },
    async getAllArea() {
      try {
        const { data } = await getAllArea();
        this.allAreaList = data;
        this.allAreaList.unshift({
          courtId: "",
          courtAreaName: "全部地区"
        });
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询地区列表失败",
          type: "warning"
        });
      }
    },
    async getCaseStatistics() {
      this.chartDatas = {
        times: [],
        allCaseNum: [],
        upLoadCaseNum: [],
        passCaseCount: []
      };
      if (this.searchFlag) {
        if (this.userInfo.roleMenus[0] == 1) {
          this.areaShowFlag = true;
          this.courtShowFlag = true;
          this.roomShowFlag = true;
          this.cbrShowFlag = true;
          this.params.flag = false;
        } else if (this.userInfo.roleMenus[0] == 2) {
          this.params.courtId = this.userInfo.courtId;
          // this.courtShowFlag = true;
          this.roomShowFlag = true;
          this.cbrShowFlag = true;
          this.params.flag = true;
          let ids = [];
          try {
            const { data } = await getRoomsByCourtId({
              courtId: this.userInfo.courtId
            });
            this.courtRoomList = data;
            this.courtRoomList.forEach(element => {
              ids.push(element.courtRoomId);
            });
            // this.params.courtRoomId = this.userInfo.courtId;
            this.courtRoomList.unshift({
              courtRoomId: ids.join("-"),
              courtRoomName: "全部庭室"
            });
          } catch (err) {
            console.log(err);
            // this.$message({
            //   message: "查询庭室列表失败",
            //   type: "warning"
            // });
          }
        } else if (this.userInfo.roleMenus[0] == 3) {
          // this.roomShowFlag = true;
          this.cbrShowFlag = true;
          this.params.courtId = this.userInfo.courtId;
          this.params.courtRoomId = this.userInfo.courtRoomId;
          let ids = [];
          this.params.flag = true;
          try {
            const { data } = await getCbrsByRoomId({
              courtId: this.userInfo.courtId,
              courtRoomId: this.userInfo.courtRoomId
            });
            if (data.length == 0) {
              this.$message({
                message: "该庭室下暂无法官信息",
                type: "warning"
              });
              this.params.cbrId = "";
              return;
            }
            this.cbrList = data;
           this.cbrList.forEach((element, index) => {
          if (element.userCode) {
            ids.push(element.userCode);
          } else {
            this.cbrList.splice(index, 1);
          }
        });
            // this.params.cbrId = ids.join("-");
            this.cbrList.unshift({
              userCode: ids.join("-"),
              userFullName: "全部法官"
            });
          } catch (err) {
            console.log(err);
            this.$message({
              message: "查询承办人列表失败",
              type: "warning"
            });
          }
        } else if (this.userInfo.roleMenus[0] == 4 && this.userInfo.userCode) {
          // this.cbrShowFlag = true;
          this.params.courtId = this.userInfo.courtId;
          this.params.courtRoomId = this.userInfo.courtRoomId;
          this.params.cbrId = this.userInfo.userCode;
        }
      }
      try {
        if (
          !this.params.flag &&
          this.params.courtId === "" &&
          this.areaId !== ""
        ) {
          this.params.courtId = this.areaId;
          const { data } = await getCountTrend(this.params);
          this.tableData = data;
          this.params.courtId = "";
        } else {
          const { data } = await getCountTrend(this.params);
          this.tableData = data;
        }
        for (let index = 0; index < this.tableData.length; index++) {
          const element = this.tableData[index];
          element.months = insertStr(element.months, 4, "-");
          this.chartDatas.times.push(element.months);
          this.chartDatas.allCaseNum.push(element.caseCount);
          this.chartDatas.upLoadCaseNum.push(element.uploadCaseCount);
          this.chartDatas.passCaseCount.push(element.passCaseCount);
        }

        this.drawEcharts(this.chartDatas);
      } catch (err) {
        console.log(err);
        this.$message({
          message: "查询统计信息失败",
          type: "warning"
        });
      }
    },
    onSearch() {
      this.searchFlag = false;
      this.getCaseStatistics();
    }
  },

  components: {}
};
</script>

<style scoped lang="scss">
#tendency {
  .r_header_title {
    margin: 0;
    font-family: MicrosoftYaHei;
    font-size: 20px;
    letter-spacing: 4px;
    // color: #ffffff;
    height: 35px;
    line-height: 30px;
    padding-left: 30px;
    position: relative;
    margin-bottom: 20px;
    .y_line {
      width: 4px;
      height: 20px;
      background-color: #02a3ff;
      display: inline-block;
      margin-right: 15px;
      position: absolute;
      top: 5px;
      left: 0px;
    }
  }
}
</style>
<style  lang="scss">
#tendency .el-input__inner {
  background-color: transparent;
  color: #fff;
  border-color: #4295cb;
}
.el-select-dropdown__empty {
  /* background-color: rgb(14, 50, 116);
   color: #fff; */
}
.el-select-dropdown__list {
  background-color: rgb(14, 50, 116);
}
.el-select-dropdown__list li {
  color: #fff;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #1e3caf;
  color: #00ffff;
}
.el-select-dropdown__list li {
}
.el-select-dropdown {
  border-color: #2c69ff;
}
</style>
