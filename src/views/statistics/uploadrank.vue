<template>
  <div id="uploadrank">
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
            <el-form-item label="时间：">
              <el-select
                v-model="timeStr"
                placeholder="请选择"
                class="search_select"
                @change="selTime"
                style="width:235px"
              >
                <el-option
                  v-for="item in timeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地区：" v-if="areaShowFlag">
              <el-select v-model="areaId" placeholder="请选择" class="search_select" @change="selArea">
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
                v-model="params.courtIdStrings"
                placeholder="请选择"
                class="search_select"
                @change="selCourt"
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
                v-model="params.courtRoomIdStrings"
                placeholder="请选择"
                class="search_select"
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
                v-model="params.cbrIdStrings"
                placeholder="请选择"
                class="search_select"
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
          <span>电子卷宗随案生成制作数量排行榜</span>
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
        <el-table-column label="所属" width="220">
          <template slot-scope="scope">
            <span>{{getName(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="uploadCaseCount" label="电子卷宗制作数量"></el-table-column>
      </el-table>
      <div class="chart">
        <div
          id="chart"
          style="width:1600px;height:600px;margin:0 auto;"
          v-show="!toggleEchartsFlag"
        ></div>
      </div>
    </div>
    <el-dialog
      title="自定义选择时间"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <el-date-picker
          v-model="params.laDateStart"
          type="date"
          format="yyyy-MM-dd"
          placeholder="选择开始日期"
          :clearable="false"
          @change="selStart"
        ></el-date-picker>
        <el-date-picker
          v-model="params.laDateEnd"
          type="date"
          format="yyyy-MM-dd"
          placeholder="选择结束日期"
          :clearable="false"
          @change="selEnd"
        ></el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="saveTime">确 定</el-button>
      </span>
    </el-dialog>
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
  timeList
} from "@/utils";
import {
  getAllArea,
  getCourtList,
  getAllCaseType,
  getRoomsByCourtId,
  getCbrsByRoomId,
  getSpcxByCasetypeId,
  getCaseStatistics,
  getAllCaseInfo
} from "@/api/quality";
export default {
  props: {},
  data() {
    return {
      toggleTitle: "生成图表",
      toggleEchartsFlag: true,
      chartDatas: [],
      dialogVisible: false,
      params: {
        courtIdStrings: "",
        courtRoomIdStrings: "",
        cbrIdStrings: "",
        queryFlag: "",
        // laDateStart: thisMonthFirsrDay,
        laDateStart: "2017-01-01",
        indexFlag: 1,
        laDateEnd: parseTime(new Date(), "{y}-{m}-{d}")
      },
      timeStr: "2017-01-01 至 " + parseTime(new Date(), "{y}-{m}-{d}"),
      areaId: "",
      timeList: timeList,
      allAreaList: [],
      courtRoomList: [],
      cbrList: [],
      courtList: [],
      tableData: [],
      courtIds: [],
      areaShowFlag: false,
      courtShowFlag: false,
      roomShowFlag: false,
      cbrShowFlag: false,
      searchFlag: true,
      selAreaFlag: true,
      selCourtFlag: false,
      selRoomFlag: false,
      selCbrFlag: false
    };
  },
  computed: { ...mapGetters(["token", "userInfo"]) },
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
    getName(row) {
      let result = "";
      if (this.params.queryFlag === "") {
        result = row.areaName;
      }
      if (this.params.queryFlag === 0) {
        result = row.courtName;
      }
      if (this.params.queryFlag == 1) {
        result = row.courtRoomName;
      }
      if (this.params.queryFlag == 2) {
        result = row.cbrName;
      }
      return result;
    },
    drawEcharts(datas) {
      // 基于准备好的dom，初始化echarts图表
      let myChart = echarts.init(document.getElementById("chart"));
      let option = {
        //电子卷宗制作与质检总体统计报表
        toolbox: {
          show: true,
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
          top: 10,
          right: 30
        },
        title: {
          show: false,
          text: " ",
          top: 15,
          textStyle: {
            //标题颜色
            color: "#fff",
            fontSize: 16
          },
          left: "30"
        },
        grid: {
          // 控制图的大小，调整下面这些值就可以，
          x: 80,
          x2: 100,
          y2: 100 // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
        },
        legend: {
          textStyle: {
            color: "#fff"
          },
          right: 60,
          top: 15
        },
        tooltip: {},
        dataset: {
          dimensions: ["city", "制作数量"],
          source: datas
        },

        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#2070db",
              width: 1
            }
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: "#fff"
            },
            rotate: -50
          }
        },
        yAxis: {
          axisLine: {
            lineStyle: {
              color: "#2070db"
            }
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: "#fff"
            }
            // rotate: -40
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#1859af"],
              width: 1,
              type: "solid"
            }
          } //网格线
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
                color: ["#00ffff"],
                label: {
                  show: false, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "white",
                    fontSize: 10
                  }
                }
              }
            }
          }
        ]
      };

      // 为echarts对象加载数据
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
        let name = "";
        if (this.params.queryFlag === "") {
          name = "areaName";
        }
        if (this.params.queryFlag === 0) {
          name = "courtName";
        }
        if (this.params.queryFlag == 1) {
          name = "courtRoomName";
        }
        if (this.params.queryFlag == 2) {
          name = "cbrName";
        }
        let filterVal = [name, "uploadCaseCount"]; // 上面是tableData里对象的属性
        const list = this.tableData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "统计报表excel");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    changeData() {
      this.$emit("changeData", "/statistics/uploadrank");
    },
    selStart() {
      this.startStr = this.params.laDateStart.getTime() / 1000; //时间戳
      this.endStr = new Date(this.params.laDateEnd).getTime() / 1000; //时间戳
      if (this.startStr > this.endStr) {
        this.$message({
          message: "开始时间不能大于结束时间",
          type: "warning"
        });
        return;
      }

      this.params.laDateStart = parseTime(
        this.params.laDateStart,
        "{y}-{m}-{d}"
      );
    },
    selEnd() {
      this.endStr = this.params.laDateEnd.getTime() / 1000; //时间戳
      this.startStr = new Date(this.params.laDateStart).getTime() / 1000; //时间戳
      if (this.startStr > this.endStr) {
        this.$message({
          message: "结束时间不能小于开始时间",
          type: "warning"
        });
        return;
      }

      this.params.laDateEnd = parseTime(this.params.laDateEnd, "{y}-{m}-{d}");
    },
    saveTime() {
      if (this.startStr > this.endStr) {
        this.$message({
          message: "开始时间不能大于结束时间",
          type: "warning"
        });
        return;
      }

      this.dialogVisible = false;
      this.timeStr = this.params.laDateStart + " 至 " + this.params.laDateEnd;
    },
    handleClose() {
      this.dialogVisible = false;
      this.params.laDateStart = "2017-01-01";
      this.params.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
      this.timeStr = "2017-01-01 至 " + this.params.laDateEnd;
    },
    selTime(id) {
      if (id == 1) {
        this.params.laDateStart = parseTime(
          getCurrentMonthFirst(),
          "{y}-{m}-{d}"
        );
        this.params.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == 2) {
        this.params.laDateStart = getLastMonth().start;
        this.params.laDateEnd = getLastMonth().end;
        this.getMsgTime(id);
      } else if (id == 3) {
        this.params.laDateStart = getFirstDayOfWeek(new Date());
        this.params.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "4") {
        this.params.laDateStart = getWeekStartAndEnd(-1)[0];
        this.params.laDateEnd = getWeekStartAndEnd(-1)[1];
        this.getMsgTime(id);
      } else if (id == "5") {
        this.params.laDateStart = parseTime(new Date(), "{y}-{m}-{d}");
        this.params.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "6") {
        this.params.laDateStart = parseTime(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          "{y}-{m}-{d}"
        );
        this.params.laDateEnd = parseTime(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          "{y}-{m}-{d}"
        );
        this.getMsgTime(id);
      } else if (id == "7") {
        this.params.laDateStart = getLastSixMonthYestdy(new Date());
        this.params.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "8") {
        this.params.laDateStart = getLastYearYestdy(new Date());
        this.params.laDateEnd = parseTime(new Date(), "{y}-{m}-{d}");
        this.getMsgTime(id);
      } else if (id == "9") {
        this.dialogVisible = true;
      }
    },
    async selArea(id) {
      this.courtRoomList = [];
      this.cbrList = [];
      this.params.courtRoomIdStrings = "";
      this.params.cbrIdStrings = "";
      this.params.courtIdStrings = "";
      this.courtList = [];
      if (id === "") {
        this.selAreaFlag = true;
        this.selCourtFlag = false;
        this.selRoomFlag = false;
        this.selCbrFlag = false;
        this.params.courtIdStrings = "";
        this.courtList = [];
      } else {
        this.courtList = [];
        let ids = [];
        this.selAreaFlag = false;
        this.selCourtFlag = true;
        this.selRoomFlag = false;
        this.selCbrFlag = false;
        try {
          const { data } = await getCourtList({ courtId: id });
          this.courtList = data.children;
          this.courtList.unshift(data);
          this.courtList.forEach(element => {
            ids.push(element.courtId);
          });
          this.courtIds = ids.join("-");
          this.params.courtIdStrings = this.courtIds;
          this.courtList.unshift({
            courtId: this.courtIds,
            courtName: "全部法院"
          });
        } catch (err) {
          console.log(err);
          this.$message({
            message: "查询法院列表失败",
            type: "warning"
          });
        }
      }
    },
    async selCourt(id) {
      this.params.cbrIdStrings = "";
      this.cbrList = [];
      if (typeof id == "string") {
        this.selAreaFlag = false;
        this.selCourtFlag = true;
        this.selRoomFlag = false;
        this.selCbrFlag = false;
        this.params.courtRoomIdStrings = "";
        this.courtRoomList = [];
        this.msg.courtName = "全部法院";
        return;
      }
      this.courtRoomList = [];
      let ids = [];
      this.params.courtIdStrings = id;
      this.selAreaFlag = false;
      this.selCourtFlag = false;
      this.selRoomFlag = true;
      this.selCbrFlag = false;
      try {
        const { data } = await getRoomsByCourtId({ courtId: id });
        this.courtRoomList = data;
        this.courtRoomList.forEach(element => {
          ids.push(element.courtRoomId);
        });
        this.params.courtRoomIdStrings = ids.join("-");
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
    },
    async selRoom(id) {
      this.cbrList = [];
      if (typeof id == "string") {
        this.selAreaFlag = false;
        this.selCourtFlag = false;
        this.selRoomFlag = true;
        this.selCbrFlag = false;
        this.params.cbrIdStrings = "";
        return;
      }
      let ids = [];
      this.selAreaFlag = false;
      this.selCourtFlag = false;
      this.selRoomFlag = false;
      this.selCbrFlag = true;
      try {
        const { data } = await getCbrsByRoomId({
          courtId: this.params.courtIdStrings,
          courtRoomId: id
        });
        if (data.length == 0) {
          this.$message({
            message: "该庭室下暂无法官信息",
            type: "warning"
          });
          this.params.cbrIdStrings = "";
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
        this.params.cbrIdStrings = ids.join("-");
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
    },
    selCbr(id) {
      this.selAreaFlag = false;
      this.selCourtFlag = false;
      this.selRoomFlag = false;
      this.selCbrFlag = true;
      this.params.cbrIdStrings = id;
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
      this.chartDatas = [];
      if (this.searchFlag) {
        if (this.userInfo.roleMenus[0] == 1) {
          this.areaShowFlag = true;
          this.courtShowFlag = true;
          this.roomShowFlag = true;
          this.cbrShowFlag = true;
        } else if (this.userInfo.roleMenus[0] == 2) {
          this.params.courtIdStrings = this.userInfo.courtId;
          // this.courtShowFlag = true;
          this.roomShowFlag = true;
          this.cbrShowFlag = true;
          this.params.queryFlag = 1;
          let ids = [];
          try {
            const { data } = await getRoomsByCourtId({
              courtId: this.userInfo.courtId
            });
            this.courtRoomList = data;
            this.courtRoomList.forEach(element => {
              ids.push(element.courtRoomId);
            });
            this.params.courtRoomIdStrings = ids.join("-");
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
          this.params.courtIdStrings = this.userInfo.courtId;
          this.params.courtRoomIdStrings = this.userInfo.courtRoomId;
          let ids = [];
          this.params.queryFlag = 2;
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
              this.params.cbrIdStrings = "";
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
            this.params.cbrIdStrings = ids.join("-");
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
          this.params.courtIdStrings = this.userInfo.courtId;
          this.params.courtRoomIdStrings = this.userInfo.courtRoomId;
          this.params.cbrIdStrings = this.userInfo.userCode;
        }
      }
      try {
        const { data } = await getCaseStatistics(this.params);
        this.tableData = data;
        this.tableData.pop();
        for (let index = 0; index < this.tableData.length; index++) {
          const element = this.tableData[index];
          if (this.params.queryFlag === "") {
            this.chartDatas[index] = {
              city: element.courtName,
              制作数量: element.uploadCaseCount
            };
          } else if (this.params.queryFlag === 0) {
            this.chartDatas[index] = {
              city: element.courtName,
              制作数量: element.uploadCaseCount
            };
          } else if (this.params.queryFlag === 1) {
            this.chartDatas[index] = {
              city: element.courtRoomName,
              制作数量: element.uploadCaseCount
            };
          } else if (this.params.queryFlag === 2) {
            this.chartDatas[index] = {
              city: element.cbrName,
              制作数量: element.uploadCaseCount
            };
          }
        }
        this.selAreaFlag = false;
        this.selCourtFlag = false;
        this.selRoomFlag = false;
        this.selCbrFlag = false;
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
      if (this.selAreaFlag) {
        this.params.queryFlag = "";
      } else if (this.selCourtFlag) {
        this.params.queryFlag = 0;
      } else if (this.selRoomFlag) {
        this.params.queryFlag = 1;
      } else if (this.selCbrFlag) {
        this.params.queryFlag = 2;
      }
      this.getCaseStatistics();
    }
  },

  components: {}
};
</script>

<style scoped lang="scss">
#uploadrank {
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
#uploadrank .el-input__inner {
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
